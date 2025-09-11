import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, interval, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

import { AppState } from '../store/app.state';
import { logout, loadTokenFromStorage } from '../store/auth/auth.actions';
import { selectUserInfo, selectIsLoading } from '../store/auth/auth.selectors';
import { User } from '../store/auth/auth.state';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  // NgRx Observables
  userInfo$: Observable<User | null>;
  isLoggingOut$: Observable<boolean>;

  sessionTimeLeft = '';
  private sessionTimer: Subscription | null = null;
  private sessionExpiry!: number;

  private store = inject(Store<AppState>);

  constructor() {
    this.userInfo$ = this.store.select(selectUserInfo);
    this.isLoggingOut$ = this.store.select(selectIsLoading);
  }

  ngOnInit() {
    // Load user info from token if available
    this.store.dispatch(loadTokenFromStorage());

    this.startSessionTimer();
  }

  ngOnDestroy() {
    if (this.sessionTimer) {
      this.sessionTimer.unsubscribe();
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
    // Dispatch logout action - NgRx will handle the rest
    this.store.dispatch(logout());
  }
}
