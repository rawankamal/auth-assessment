import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { interval, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


interface UserInfo {
  id: string;
  name: string;
  email: string;
  loginTime: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class DashboardComponent implements OnInit, OnDestroy {
  userInfo: UserInfo | null = null;
  sessionTimeLeft = '';
  private sessionTimer: Subscription | null = null;
  private sessionExpiry!: number;

  constructor() {
    this.sessionExpiry = 0;
  }

  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.loadUserInfo();
    this.startSessionTimer();
  }

  ngOnDestroy() {
    if (this.sessionTimer) {
      this.sessionTimer.unsubscribe();
    }
  }

  loadUserInfo() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decode JWT payload (base64 decode the middle part)
        const payload = JSON.parse(atob(token.split('.')[1]));

        this.userInfo = {
          id: payload.sub || payload.id || '507f1f77bcf86cd799439011',
          name: payload.name || 'Test User',
          email: payload.email || 'test@example.com',
          loginTime: new Date().toLocaleString(),
        };
      } catch (error) {
        console.error('Invalid JWT token:', error);
  localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  startSessionTimer() {
    const sessionDuration = 8 * 60 * 60 * 1000; // 8 hours in ms
    this.sessionExpiry = Date.now() + sessionDuration;

    this.sessionTimer = interval(1000).subscribe(() => {
      const now = Date.now();
      const timeLeft = Math.max(0, Math.floor((this.sessionExpiry - now) / 1000));

      if (timeLeft <= 0) {
        this.logout();
        return;
      }

      const hours = Math.floor(timeLeft / 3600);
      const minutes = Math.floor((timeLeft % 3600) / 60);
      const seconds = timeLeft % 60;

      this.sessionTimeLeft = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    });
  }

  logout() {
    this.authService.logout();
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
