import { Component, OnInit } from '@angular/core';
import { VideoItem, VideoService } from '../services/video.service';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  standalone: true,
  imports: [NgForOf, FormsModule, NgIf],
  styleUrls: ['./manage.component.css'],
})
export class ManageComponent implements OnInit {
  videos: VideoItem[] = [];

  constructor(private videoService: VideoService) {}

  ngOnInit() {
    this.videoService.getVideos().subscribe((data) => {
      this.videos = data;
    });
  }

  addVideo() {
    const newVideo: VideoItem = {
      name: '',
      description: '',
      vimeo_id: '',
      gps_latitude: 0,
      gps_longitude: 0,
      editable: true, // Flag to indicate the row is editable
    };
    this.videos.push(newVideo);
  }

  deleteVideo(video: VideoItem) {
    this.videoService.deleteVideo(video).subscribe(() => {
      this.videos = this.videos.filter((v) => v.id !== video.id);
    });
  }

  editVideo(video: VideoItem) {
    video.editable = true; // Make the row editable
  }

  saveVideo(video: VideoItem, index: number) {
    if (video.id) {
      // Call service to update the video
      this.videoService.saveVideoEdit(video).subscribe(() => {
        this.videos[index].editable = false; // Make the row non-editable after save
      });
    } else {
      // Call service to save new video
      this.videoService.addVideo(video).subscribe((savedVideo: VideoItem) => {
        this.videos[index] = savedVideo;
        this.videos[index].editable = false; // Make the row non-editable after save
      });
    }
  }

  cancelEdit(video: VideoItem, index: number) {
    if (video.id === undefined) {
      // If it's a new video (temporary ID is -1), remove it from the array
      this.videos.splice(index, 1);
    } else {
      // If it's an existing video, revert any changes
      // This could involve re-fetching the video details from the server if changes were made
      // For simplicity, here we're just setting editable to false
      this.videos[index].editable = false;
    }
  }
}
