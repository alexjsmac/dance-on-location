use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::Json;
use axum::response::IntoResponse;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

use crate::DbState;

#[derive(Deserialize, Debug)]
pub struct VideoNew {
    pub name: String,
    pub description: String,
    pub url: String,
    pub gps_latitude: f64,
    pub gps_longitude: f64,
}

#[derive(Serialize, Deserialize, Debug, FromRow, PartialEq)]
pub struct Video {
    pub id: i32,
    pub name: String,
    pub description: String,
    pub url: String,
    pub gps_latitude: f64,
    pub gps_longitude: f64,
}

pub async fn videos(State(state): State<DbState>) -> Result<impl IntoResponse, impl IntoResponse> {
    match sqlx::query_as::<_, Video>("SELECT * FROM videos")
        .fetch_all(&state.pool)
        .await
    {
        Ok(videos) => Ok((StatusCode::OK, Json(videos))),
        Err(e) => Err((StatusCode::BAD_REQUEST, e.to_string())),
    }
}

pub async fn add_video(
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

pub async fn delete_video(
    State(state): State<DbState>,
    Path(id): Path<i32>,
) -> Result<impl IntoResponse, impl IntoResponse> {
    match sqlx::query("DELETE FROM videos WHERE id = $1")
        .bind(id)
        .execute(&state.pool)
        .await
    {
        Ok(_) => Ok(StatusCode::NO_CONTENT),
        Err(e) => Err((StatusCode::BAD_REQUEST, e.to_string())),
    }
}

pub async fn update_video(
    State(state): State<DbState>,
    Path(id): Path<i32>,
    Json(data): Json<VideoNew>,
) -> Result<impl IntoResponse, impl IntoResponse> {
    match sqlx::query("UPDATE videos SET name = $1, description = $2, url = $3, gps_latitude = $4, gps_longitude = $5 WHERE id = $6")
        .bind(&data.name)
        .bind(&data.description)
        .bind(&data.url)
        .bind(data.gps_latitude)
        .bind(data.gps_longitude)
        .bind(id)
        .execute(&state.pool)
        .await
    {
        Ok(_) => Ok(StatusCode::NO_CONTENT),
        Err(e) => Err((StatusCode::BAD_REQUEST, e.to_string())),
    }
}
