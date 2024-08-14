import { NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../services/auth.service';
import { MetaAndTitleService } from '../services/meta-and-title.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | undefined;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  constructor(private metaAndTitleService: MetaAndTitleService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.metaAndTitleService.updateTitle('Login');
    this.metaAndTitleService.updateDescription('Login to the admin account.');
  }

  login() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username, password).subscribe({
        next: () => {
          this.authService.login(username, password);
        },
        error: () => {
          this.errorMessage = this.authService.getLoginError();
        },
      });
    }
  }
}
