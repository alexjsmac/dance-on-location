use axum::{
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use tower_http::cors::{Any, CorsLayer};

#[tokio::main]
async fn main() {
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/", get(root))
        .route("/admin/login", post(admin_login))
        .route("/admin/upload", post(upload_video))
        .layer(cors);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
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
