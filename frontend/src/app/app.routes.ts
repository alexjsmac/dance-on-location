import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { PlaybackComponent } from './playback/playback.component';
import { AuthGuard } from './guards/auth-guard.guard';
import { ManageComponent } from './manage/manage.component';

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
