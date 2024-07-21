use std::sync::Mutex;

use axum::routing::post;
use axum::{routing::get, Extension, Json, Router};
use once_cell::sync::Lazy;
use serde::{Deserialize, Serialize};
use shuttle_runtime::SecretStore;
use tower_http::cors::{Any, CorsLayer};

use crate::auth::{login, AuthError, AuthPayload, Claims};

mod auth;

static JWT_SECRET: Lazy<Mutex<Option<String>>> = Lazy::new(|| Mutex::new(None));

#[shuttle_runtime::main]
async fn main(#[shuttle_runtime::Secrets] secrets: SecretStore) -> shuttle_axum::ShuttleAxum {
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let state = AuthPayload {
        client_id: secrets.get("CLIENT_ID").expect("CLIENT_ID not found"),
        client_secret: secrets
            .get("CLIENT_SECRET")
            .expect("CLIENT_SECRET not found"),
    };

    // Fetch the JWT secret
    let secret = secrets.get("JWT_SECRET").expect("JWT_SECRET not found");

    // Store the secret for synchronous access
    let mut jwt_secret = JWT_SECRET.lock().unwrap();
    *jwt_secret = Some(secret);

    let app = Router::new()
        .route("/", get(root))
        .route("/login", post(login))
        .route("/videos/upload", post(upload_video))
        .route("/videos", get(videos))
        .layer(Extension(state))
        .layer(cors);

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

async fn videos(_claims: Claims) -> Result<String, AuthError> {
    // Send the protected data to the user
    Ok(r#"[{"id": "A", "video_url": "video1.mp4", "gps_coordinates": [0,1]}]"#.to_string())
}

#[derive(Serialize, Deserialize)]
struct UploadRequest {
    video_url: String,
    gps_coordinates: (f64, f64),
}

async fn upload_video(Json(_payload): Json<UploadRequest>) -> &'static str {
    // Return a json string
    r#"{"status": "uploaded"}"#
}
