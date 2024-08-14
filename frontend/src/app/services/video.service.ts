import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface VideoItem {
  editable: boolean;
  id?: number;
  name: string;
  description: string;
  vimeo_id: string;
  gps_latitude: number;
  gps_longitude: number;
  range: number;
}

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  getVideos(): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<VideoItem[]>(`${this.apiUrl}/videos`, { headers });
  }

  saveVideoEdit(video: VideoItem): Observable<any> {
    return this.http.put<VideoItem[]>(`${this.apiUrl}/videos/${video.id}`, video);
  }

  addVideo(video: VideoItem) {
    return this.http.post<VideoItem>(`${this.apiUrl}/videos`, video);
  }

  deleteVideo(video: VideoItem) {
    return this.http.delete(`${this.apiUrl}/videos/${video.id}`);
  }
}
