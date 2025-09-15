import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrls: ['../login/login.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm;
  errorMessage = '';
  successMessage = '';
  isLoading = false;
  resetToken = '';

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Get reset token from query parameters
    this.resetToken = this.route.snapshot.queryParams['token'] || '';
    if (!this.resetToken) {
      this.errorMessage = 'Invalid reset link';
    }
  }

  get passwordMismatch(): boolean {
    const password = this.resetPasswordForm.get('newPassword')?.value;
    const confirmPassword = this.resetPasswordForm.get('confirmPassword')?.value;
    return password !== confirmPassword &&
      this.resetPasswordForm.get('confirmPassword')?.touched === true;
  }

  onSubmit() {
    if (this.resetPasswordForm.invalid || !this.resetToken) return;

    this.isLoading = true;
    const { newPassword } = this.resetPasswordForm.value;

    this.authService.resetPassword(this.resetToken, newPassword!).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.successMessage = res.message;
        // Redirect to login after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to reset password';
      }
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
