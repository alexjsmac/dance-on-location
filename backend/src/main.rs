mod auth;

use crate::auth::{login, AuthError, Claims};
use axum::routing::post;
use axum::{routing::get, Json, Router};
use serde::{Deserialize, Serialize};
use tower_http::cors::{Any, CorsLayer};

#[shuttle_runtime::main]
async fn main() -> shuttle_axum::ShuttleAxum {
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/", get(root))
        .route("/login", post(login))
        .route("/videos/upload", post(upload_video))
        .route("/videos", get(videos))
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

async fn videos(claims: Claims) -> Result<String, AuthError> {
    // Send the protected data to the user
    println!("Claims: {:?}", claims);
    Ok(r#"[{"id": "A", "video_url": "video1.mp4", "gps_coordinates": [0,1]}]"#.to_string())
}

#[derive(Serialize, Deserialize)]
struct UploadRequest {
    video_url: String,
    gps_coordinates: (f64, f64),
}

async fn upload_video(Json(_payload): Json<UploadRequest>) -> &'static str {
    println!("Upload request");
    // Return a json string
    r#"{"status": "uploaded"}"#
}
