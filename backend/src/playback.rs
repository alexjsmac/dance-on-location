use axum::extract::{Query, State};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::Json;
use serde::{Deserialize, Serialize};

use crate::video::Video;
use crate::DbState;

#[derive(Serialize, Deserialize)]
pub struct GpsCoordinates {
    pub latitude: f64,
    pub longitude: f64,
}

pub async fn check_in_range(
    Query(coords): Query<GpsCoordinates>,
    State(state): State<DbState>,
) -> Result<impl IntoResponse, impl IntoResponse> {
    let videos = get_videos_list(state).await.unwrap();

    if let Some(value) = nearby_video(coords, videos) {
        return Ok::<(StatusCode, Json<Option<Video>>), ()>((StatusCode::OK, Json(value.0)));
    }

    Ok((StatusCode::OK, Json(None::<Video>)))
}

fn nearby_video(coords: GpsCoordinates, videos: Vec<Video>) -> Option<Json<Option<Video>>> {
    for video in videos {
        let distance = haversine_distance(
            coords.latitude,
            coords.longitude,
            video.gps_latitude,
            video.gps_longitude,
        );

        if distance < video.range {
            return Some(Json(Some(video)));
        }
    }
    None
}

async fn get_videos_list(state: DbState) -> Result<Vec<Video>, String> {
    match sqlx::query_as::<_, Video>("SELECT * FROM videos")
        .fetch_all(&state.pool)
        .await
    {
        Ok(videos) => Ok(videos),
        Err(_) => Err("Failed to fetch videos".to_string()),
    }
}

fn haversine_distance(lat1: f64, lon1: f64, lat2: f64, lon2: f64) -> f64 {
    let r = 6371.0; // Earth radius in kilometers

    let d_lat = (lat2 - lat1).to_radians();
    let d_lon = (lon2 - lon1).to_radians();

    let a = (d_lat / 2.0).sin().powi(2)
        + lat1.to_radians().cos() * lat2.to_radians().cos() * (d_lon / 2.0).sin().powi(2);

    let c = 2.0 * a.sqrt().atan2((1.0 - a).sqrt());

    r * c
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_check_nearby_video() {
        let coords = GpsCoordinates {
            latitude: 37.7749,
            longitude: -122.4194,
        };
        let videos = vec![
            Video {
                id: 1,
                name: "test".to_string(),
                description: "test".to_string(),
                vimeo_id: "test".to_string(),
                gps_latitude: 37.8199,
                gps_longitude: -122.4783,
                range: 0.1,
            },
            Video {
                id: 2,
                name: "test".to_string(),
                description: "test".to_string(),
                vimeo_id: "test".to_string(),
                gps_latitude: 37.7749,
                gps_longitude: -122.4194,
                range: 0.1,
            },
        ];
        let result = nearby_video(coords, videos);
        assert_eq!(
            result.unwrap().0,
            Some(Video {
                id: 2,
                name: "test".to_string(),
                description: "test".to_string(),
                vimeo_id: "test".to_string(),
                gps_latitude: 37.7749,
                gps_longitude: -122.4194,
                range: 0.1,
            })
        );
    }

    #[tokio::test]
    async fn test_haversine_distance() {
        let lat1 = 42.989532463893525;
        let lon1 = -81.18868691992738;
        let lat2 = 42.989732463893525;
        let lon2 = -81.18898691992738;
        let distance = haversine_distance(lat1, lon1, lat2, lon2);
        assert!(distance.abs() < 0.1);
    }
}
