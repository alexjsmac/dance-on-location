import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface VideoItem {
  id: number;
  video_url: string;
  gps_coordinates: [number, number];
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

  getVideos(): Observable<VideoItem[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<VideoItem[]>(`${this.apiUrl}/videos`, { headers });
  }
}
