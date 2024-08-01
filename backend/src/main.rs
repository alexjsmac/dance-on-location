use std::sync::Mutex;

use axum::{Extension, Router, routing::get};
use axum::routing::{delete, post};
use once_cell::sync::Lazy;
use shuttle_runtime::SecretStore;
use sqlx::PgPool;
use tower_http::cors::{Any, CorsLayer};

use crate::auth::{AuthPayload, login};
use crate::playback::check_in_range;
use crate::video::{add_video, delete_video, update_video, videos};

mod auth;
mod playback;
mod video;

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
        .route("/check-in-range", get(check_in_range))
        .route("/login", post(login))
        .route("/videos", post(add_video).get(videos))
        .route("/videos/:id", delete(delete_video).put(update_video))
        .layer(Extension(auth_state))
        .layer(cors)
        .with_state(db_state);

    Ok(app.into())
}

async fn root() -> &'static str {
    "Welcome to the video hosting site!"
}
