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
        .route("/admin/login", post(admin_login))
        .route("/admin/upload", post(upload_video))
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

async fn admin_login(Json(_payload): Json<LoginRequest>) -> &'static str {
    println!("Login request");
    // Return a json string
    r#"{"status": "logged_in"}"#
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
