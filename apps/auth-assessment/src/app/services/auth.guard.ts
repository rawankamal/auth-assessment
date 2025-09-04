import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private router = inject(Router);

  canActivate(): boolean {
    const token = localStorage.getItem('token');

    if (!token) {
      console.log('No token found, redirecting to login');
      this.router.navigate(['/login']);
      return false;
    }

    try {
      // Decode JWT payload (middle part of token)
      const payload = JSON.parse(atob(token.split('.')[1]));

      // Check if token is expired
      const currentTime = Math.floor(Date.now() / 1000);
      const isExpired = payload.exp < currentTime;

      if (isExpired) {
        console.warn('Token expired, redirecting to login');
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
        return false;
      }

      console.log('Token is valid, allowing access');
      return true;

    } catch (error) {
      console.error('Invalid token format:', error);
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
