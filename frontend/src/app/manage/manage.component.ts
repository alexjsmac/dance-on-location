import { Component, OnInit } from '@angular/core';
import { VideoItem, VideoService } from '../services/video.service';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  standalone: true,
  imports: [NgForOf],
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
}
