use std::sync::Mutex;

use axum::{Extension, Json, Router, routing::get};
use axum::extract::State;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::routing::post;
use once_cell::sync::Lazy;
use serde::{Deserialize, Serialize};
use shuttle_runtime::SecretStore;
use sqlx::{FromRow, PgPool};
use tower_http::cors::{Any, CorsLayer};

use crate::auth::{AuthPayload, login};

mod auth;

static JWT_SECRET: Lazy<Mutex<Option<String>>> = Lazy::new(|| Mutex::new(None));

#[derive(Clone)]
struct DbState {
    pool: PgPool,
}

#[shuttle_runtime::main]
async fn main(
    #[shuttle_runtime::Secrets] secrets: SecretStore,
    #[shuttle_shared_db::Postgres] pool: PgPool,
) -> shuttle_axum::ShuttleAxum {
    sqlx::migrate!()
        .run(&pool)
        .await
        .expect("Failed to run migrations");

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let auth_state = AuthPayload {
        client_id: secrets.get("CLIENT_ID").expect("CLIENT_ID not found"),
        client_secret: secrets
            .get("CLIENT_SECRET")
            .expect("CLIENT_SECRET not found"),
    };

    let secret = secrets.get("JWT_SECRET").expect("JWT_SECRET not found");
    let mut jwt_secret = JWT_SECRET.lock().unwrap();
    *jwt_secret = Some(secret);

    let db_state = DbState { pool };
    let app = Router::new()
        .route("/", get(root))
        .route("/login", post(login))
        .route("/videos", post(add_video).get(videos))
        .layer(Extension(auth_state))
        .layer(cors)
        .with_state(db_state);

    Ok(app.into())
}

async fn root() -> &'static str {
    "Welcome to the video hosting site!"
}

#[derive(Serialize, Deserialize)]
struct LoginRequest {
    username: String,
    password: String,
}

async fn videos(State(state): State<DbState>) -> Result<impl IntoResponse, impl IntoResponse> {
    match sqlx::query_as::<_, Video>("SELECT * FROM videos")
        .fetch_all(&state.pool)
        .await
    {
        Ok(videos) => Ok((StatusCode::OK, Json(videos))),
        Err(e) => Err((StatusCode::BAD_REQUEST, e.to_string())),
    }
}

async fn add_video(
    State(state): State<DbState>,
    Json(data): Json<VideoNew>,
) -> Result<impl IntoResponse, impl IntoResponse> {
    match sqlx::query_as::<_, Video>("INSERT INTO videos (name, description, url, gps_latitude, gps_longitude) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, description, url, gps_latitude, gps_longitude")
        .bind(&data.name)
        .bind(&data.description)
        .bind(&data.url)
        .bind(data.gps_latitude)
        .bind(data.gps_longitude)
        .fetch_one(&state.pool)
        .await
    {
        Ok(video) => Ok((StatusCode::CREATED, Json(video))),
        Err(e) => Err((StatusCode::BAD_REQUEST, e.to_string())),
    }
}

#[derive(Deserialize, Debug)]
struct VideoNew {
    pub name: String,
    pub description: String,
    pub url: String,
    pub gps_latitude: f64,
    pub gps_longitude: f64,
}

#[derive(Serialize, FromRow)]
struct Video {
    pub id: i32,
    pub name: String,
    pub description: String,
    pub url: String,
    pub gps_latitude: f64,
    pub gps_longitude: f64,
}
