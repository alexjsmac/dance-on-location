import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NgIf } from '@angular/common';
import { environment } from '../../environments/environment';
import { VideoItem } from '../services/video.service';
import Player from '@vimeo/player';

interface GpsCoordinates {
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'app-playback',
  standalone: true,
  imports: [NgIf],
  templateUrl: './playback.component.html',
  styleUrls: ['./playback.component.css'],
})
export class PlaybackComponent implements OnInit, OnDestroy, AfterViewChecked {
  videoItem: VideoItem | null = null;
  message = 'Getting location...';
  isLoading = true;
  isPlaying: boolean = false; // Track if video is currently playing
  @ViewChild('vimeoContainer') vimeoContainer!: ElementRef;
  private apiUrl = environment.apiUrl;
  private watchPositionId?: number;
  private httpSubscription?: Subscription;
  private vimeoPlayer?: Player; // Vimeo player instance

  constructor(private http: HttpClient) {}

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

  ngAfterViewChecked() {
    // Check if the Vimeo container is available and not yet initialized
    if (
      this.vimeoContainer &&
      this.videoItem &&
      !this.vimeoPlayer &&
      this.videoItem.vimeo_id
    ) {
      this.initializeVimeoPlayer(this.videoItem.vimeo_id);
    }
  }

  ngOnDestroy() {
    if (this.watchPositionId) {
      navigator.geolocation.clearWatch(this.watchPositionId);
    }
    if (this.httpSubscription) {
      this.httpSubscription.unsubscribe();
    }
    if (this.vimeoPlayer) {
      this.vimeoPlayer.destroy();
    }
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
            if (this.vimeoContainer) {
              this.initializeVimeoPlayer(video.vimeo_id);
            }
          } else if (!video) {
            this.videoItem = null;
            this.message = 'No videos found';
            this.isPlaying = false;
            if (this.vimeoPlayer) {
              this.vimeoPlayer.destroy();
            }
          }
        },
        error: (error) => {
          console.error('HTTP error:', error);
          this.message = 'No videos found';
        },
      });
  }

  private initializeVimeoPlayer(vimeoId: string) {
    if (this.vimeoPlayer) {
      this.vimeoPlayer.destroy();
    }

    this.vimeoPlayer = new Player(this.vimeoContainer!.nativeElement, {
      id: Number(vimeoId),
      responsive: true,
      byline: false,
      playsinline: false,
      portrait: false,
      title: false,
      pip: false,
    });

    this.vimeoPlayer.on('play', () => {
      this.isPlaying = true;
    });

    this.vimeoPlayer.on('pause', () => {
      this.isPlaying = false;
    });

    this.vimeoPlayer.on('ended', () => {
      this.isPlaying = false;
    });
  }
}
