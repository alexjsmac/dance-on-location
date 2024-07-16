import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {
  videoUrl: string = '';
  latitude: number = 0;
  longitude: number = 0;

  constructor(private http: HttpClient) {this.upload()}

  upload() {
    const payload = { video_url: this.videoUrl, gps_coordinates: [this.latitude, this.longitude] };
    this.http.post('http://0.0.0.0:3000/admin/upload', payload).subscribe(response => {
      console.log(response);
    });
  }
}
