import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'],
})
export class SignupComponent {
  errorMessage = '';
  successMessage = '';
  isLoading = false;
  signupForm;

  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  constructor() {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.signupForm.invalid) return;

    this.isLoading = true;
    const { name, email, password } = this.signupForm.value;

    this.authService.signup({ name: name!, email: email!, password: password! }).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.successMessage = 'Signup successful!';
        localStorage.setItem('token', res.token); // نحفظ التوكن بعد التسجيل
        this.router.navigate(['/dashboard']);     // نحول للدdashboard
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Signup failed. Try again!';
      },
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
