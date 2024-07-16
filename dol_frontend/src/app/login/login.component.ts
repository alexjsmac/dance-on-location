import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) {this.login()}

  login() {
    const payload = { username: this.username, password: this.password };
    this.http.post('http://0.0.0.0:3000/admin/login', payload).subscribe(response => {
      console.log(response);
    });
  }
}
