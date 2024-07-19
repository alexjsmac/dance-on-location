import { Component } from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent} from "./home/home.component";
import {ManageComponent} from "./manage/manage.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, ManageComponent, RouterLink, HomeComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'dance_on_location';

  constructor(private router: Router) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token'); // Remove the token
    this.router.navigate(['/login']); // Redirect to login
  }
}
