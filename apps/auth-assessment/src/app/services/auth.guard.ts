import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, take } from 'rxjs';
import { AppState } from '../store/app.state';
import { selectIsAuthenticated } from '../store/auth/auth.selectors';
import { loadTokenFromStorage } from '../store/auth/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private store = inject(Store<AppState>);
  private router = inject(Router);

  canActivate(): Observable<boolean> {
    // First, try to load token from storage
    this.store.dispatch(loadTokenFromStorage());

    return this.store.select(selectIsAuthenticated).pipe(
      take(1),
      map(isAuthenticated => {
        if (isAuthenticated) {
          return true;
        } else {
          console.log('User not authenticated, redirecting to login');
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}
