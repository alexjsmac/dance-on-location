import { NgForOf, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MetaAndTitleService } from '../services/meta-and-title.service';
import { VideoItem, VideoService } from '../services/video.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  standalone: true,
  imports: [NgForOf, FormsModule, NgIf],
  styleUrls: ['./manage.component.scss'],
})
export class ManageComponent implements OnInit {
  videos: VideoItem[] = [];

  constructor(
    private videoService: VideoService,
    private metaAndTitleService: MetaAndTitleService,
  ) {}

  ngOnInit() {
    this.metaAndTitleService.updateTitle('Manage');
    this.metaAndTitleService.updateDescription(
      'Manage dance videos offered by Dance on Location.',
    );
    this.videoService.getVideos().subscribe((data: VideoItem[]) => {
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
      range: 0,
      editable: true, // Flag to indicate the row is editable
    };
    this.videos.push(newVideo);
  }

  deleteVideo(video: VideoItem) {
    this.videoService.deleteVideo(video).subscribe(() => {
      this.videos = this.videos.filter(v => v.id !== video.id);
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
