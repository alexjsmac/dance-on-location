import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth-guard.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ManageComponent } from './manage/manage.component';
import { PlaybackComponent } from './playback/playback.component';

export const routes: Routes = [
  { path: '', title: 'Dance on Location | Home', component: HomeComponent },
  {
    path: 'playback',
    title: 'Dance on Location | Playback',
    component: PlaybackComponent,
  },
  {
    path: 'login',
    title: 'Dance on Location | Login',
    component: LoginComponent,
  },
  {
    path: 'manage',
    title: 'Dance on Location | Manage',
    component: ManageComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
