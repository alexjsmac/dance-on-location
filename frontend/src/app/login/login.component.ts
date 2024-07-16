import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {this.login()}

  login() {
    const payload = { username: this.username, password: this.password };
    this.http.post(`${this.apiUrl}/admin/login`, payload).subscribe(response => {
      console.log(response);
    });
  }
}
