import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NgIf } from '@angular/common';
import { environment } from '../../environments/environment';
import { VideoItem } from '../services/video.service';
import { DomSanitizer } from '@angular/platform-browser';

interface GpsCoordinates {
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'app-playback',
  standalone: true,
  imports: [NgIf],
  templateUrl: './playback.component.html',
  styleUrl: './playback.component.css',
})
export class PlaybackComponent implements OnInit, OnDestroy {
  videoItem: VideoItem | null = null;
  message = 'Getting location...';
  isLoading = true;
  isPlaying: boolean = false;
  private apiUrl = environment.apiUrl;
  private watchPositionId?: number;
  private httpSubscription?: Subscription;

  constructor(
    protected sanitizer: DomSanitizer,
    private http: HttpClient,
  ) {}

  // Generate the Vimeo embed URL
  getVimeoEmbedUrl(vimeoId: string): string {
    return `https://player.vimeo.com/video/${vimeoId}`;
  }

  ngOnInit() {
    if (navigator.geolocation) {
      this.watchPositionId = navigator.geolocation.watchPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          this.isLoading = false;

          // Check if the video is playing
          if (!this.isPlaying) {
            this.checkInRange(coords);
          }
        },
        (error) => {
          console.error('GPS error:', error);
          this.message = 'Failed to get location';
          this.isLoading = false;
        },
        {
          enableHighAccuracy: false,
          timeout: Infinity,
          maximumAge: 0,
        },
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      this.message = 'Geolocation is not supported by this browser.';
      this.isLoading = false;
    }
  }

  ngOnDestroy() {
    if (this.watchPositionId) {
      navigator.geolocation.clearWatch(this.watchPositionId);
    }
    if (this.httpSubscription) {
      this.httpSubscription.unsubscribe();
    }
  }

  onPlayVideo() {
    this.isPlaying = true;
  }

  onPauseVideo() {
    this.isPlaying = false;
  }

  private checkInRange(coords: GpsCoordinates) {
    this.httpSubscription = this.http
      .get<VideoItem | null>(`${this.apiUrl}/check-in-range`, {
        params: {
          latitude: coords.latitude,
          longitude: coords.longitude,
        },
      })
      .subscribe({
        next: (video) => {
          if (video && this.videoItem?.id !== video.id) {
            this.videoItem = video;
            this.message = '';
            this.isPlaying = false;
          } else if (!video) {
            this.videoItem = null;
            this.message = 'No videos found';
            this.isPlaying = false;
          }
        },
        error: (error) => {
          console.error('HTTP error:', error);
          this.message = 'No videos found';
        },
      });
  }
}
