import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth-guard.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ManageComponent } from './manage/manage.component';
import { PlaybackComponent } from './playback/playback.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'playback',
    component: PlaybackComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'manage',
    component: ManageComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
