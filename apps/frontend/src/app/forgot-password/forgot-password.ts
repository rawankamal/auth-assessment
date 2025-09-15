import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['../login/login.css'], // Reuse login styles
})
export class ForgotPasswordComponent {
  forgotPasswordForm;
  errorMessage = '';
  successMessage = '';
  resetToken = '';
  isLoading = false;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) return;

    this.isLoading = true;
    const { email } = this.forgotPasswordForm.value;

    this.authService.forgotPassword(email!).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.successMessage = res.message;
        this.resetToken = res.resetToken; // Remove in production
        this.forgotPasswordForm.reset();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage =
          err.error?.message || 'Failed to send reset instructions';
      },
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
  getResetLink(): string {
    if (!this.resetToken) return '';
    const { protocol, hostname, port } = window.location;
    const baseUrl = `${protocol}//${hostname}${port ? `:${port}` : ''}`;
    return `${baseUrl}/reset-password?token=${this.resetToken}`;
  }
}
