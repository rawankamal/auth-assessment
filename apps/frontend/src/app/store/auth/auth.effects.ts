import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import * as AuthActions from './auth.actions';
import { User } from './auth.state';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Login Effect
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ email, password }) =>
        this.authService.login(email, password).pipe(
          map((response: any) => {
            // Save token to localStorage
            localStorage.setItem('token', response.access_token);

            // Decode JWT to get user info
            const payload = JSON.parse(atob(response.access_token.split('.')[1]));
            const user: User = {
              id: payload.sub,
              name: payload.name,
              email: payload.email,
              loginTime: new Date().toLocaleString(),
            };

            return AuthActions.loginSuccess({
              user,
              token: response.access_token,
            });
          }),
          catchError((error) =>
            of(
              AuthActions.loginFailure({
                error: error.error?.message || 'Login failed',
              })
            )
          )
        )
      )
    )
  );

  // Login Success Effect - Navigate to dashboard
  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => {
          this.router.navigate(['/dashboard']);
        })
      ),
    { dispatch: false }
  );

  // Signup Effect
  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signup),
      exhaustMap(({ name, email, password }) =>
        this.authService.signup({ name, email, password }).pipe(
          map((response: any) => {
            // Note: Backend doesn't return token on signup, so we'll need to login
            // For now, let's assume successful signup navigates to login
            return AuthActions.signupSuccess({
              user: { id: response.userId, name, email },
              token: '', // No token from signup endpoint
            });
          }),
          catchError((error) =>
            of(
              AuthActions.signupFailure({
                error: error.error?.message || 'Signup failed',
              })
            )
          )
        )
      )
    )
  );

  // Signup Success Effect - Navigate to login
  signupSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signupSuccess),
        tap(() => {
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );

  // Logout Effect
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      exhaustMap(() => {
        const token = localStorage.getItem('token');

        // Call backend logout if token exists
        if (token) {
          return this.authService.logout().pipe(
            map(() => AuthActions.logoutSuccess()),
            catchError((error) => {
              // Even if backend logout fails, still logout locally
              console.error('Backend logout failed:', error);
              return of(AuthActions.logoutSuccess());
            })
          );
        } else {
          // No token, just logout locally
          return of(AuthActions.logoutSuccess());
        }
      })
    )
  );

  // Logout Success Effect - Clear localStorage and navigate to login
  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => {
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );

  // Load Token from Storage Effect
  loadTokenFromStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadTokenFromStorage),
      map(() => {
        const token = localStorage.getItem('token');

        if (token) {
          try {
            // Decode JWT to get user info and check expiration
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Math.floor(Date.now() / 1000);

            if (payload.exp < currentTime) {
              // Token expired
              localStorage.removeItem('token');
              return AuthActions.clearToken();
            }

            const user: User = {
              id: payload.sub,
              name: payload.name,
              email: payload.email,
            };

            return AuthActions.setToken({ token, user });
          } catch (error) {
            // Invalid token
            localStorage.removeItem('token');
            return AuthActions.clearToken();
          }
        } else {
          return AuthActions.clearToken();
        }
      })
    )
  );

  // Forgot Password Effect
  forgotPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.forgotPassword),
      exhaustMap(({ email }) =>
        this.authService.forgotPassword(email).pipe(
          map((response: any) =>
            AuthActions.forgotPasswordSuccess({
              message: response.message,
              resetToken: response.resetToken, // For testing
            })
          ),
          catchError((error) =>
            of(
              AuthActions.forgotPasswordFailure({
                error: error.error?.message || 'Failed to send reset instructions',
              })
            )
          )
        )
      )
    )
  );

  // Reset Password Effect
  resetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.resetPassword),
      exhaustMap(({ token, newPassword }) =>
        this.authService.resetPassword(token, newPassword).pipe(
          map((response: any) =>
            AuthActions.resetPasswordSuccess({
              message: response.message,
            })
          ),
          catchError((error) =>
            of(
              AuthActions.resetPasswordFailure({
                error: error.error?.message || 'Failed to reset password',
              })
            )
          )
        )
      )
    )
  );

  // Reset Password Success Effect - Navigate to login after 2 seconds
  resetPasswordSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.resetPasswordSuccess),
        tap(() => {
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        })
      ),
    { dispatch: false }
  );
}
