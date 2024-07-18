import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UploadComponent } from './upload/upload.component';
import {HomeComponent} from "./home/home.component";
import {PlaybackComponent} from "./playback/playback.component";

export const routes: Routes = [
  { path: '', title: 'Home Page', component: HomeComponent },
  { path: 'playback', title: 'Playback Page', component: PlaybackComponent },
  { path: 'login', component: LoginComponent },
  { path: 'upload', component: UploadComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
