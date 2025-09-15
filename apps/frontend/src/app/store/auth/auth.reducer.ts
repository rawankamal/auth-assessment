import { createReducer, on } from '@ngrx/store';
import { AuthState, initialAuthState } from './auth.state';
import * as AuthActions from './auth.actions';

export const authReducer = createReducer(
  initialAuthState,

  // Login
  on(AuthActions.login, (state): AuthState => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(AuthActions.loginSuccess, (state, { user, token }): AuthState => ({
    ...state,
    user,
    token,
    isLoading: false,
    error: null,
    isAuthenticated: true,
  })),

  on(AuthActions.loginFailure, (state, { error }): AuthState => ({
    ...state,
    isLoading: false,
    error,
    isAuthenticated: false,
  })),

  // Signup
  on(AuthActions.signup, (state): AuthState => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(AuthActions.signupSuccess, (state, { user, token }): AuthState => ({
    ...state,
    user,
    token,
    isLoading: false,
    error: null,
    isAuthenticated: true,
  })),

  on(AuthActions.signupFailure, (state, { error }): AuthState => ({
    ...state,
    isLoading: false,
    error,
    isAuthenticated: false,
  })),

  // Logout
  on(AuthActions.logout, (state): AuthState => ({
    ...state,
    isLoading: true,
  })),

  on(AuthActions.logoutSuccess, (): AuthState => ({
    ...initialAuthState,
  })),

  on(AuthActions.logoutFailure, (state, { error }): AuthState => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Token Management
  on(AuthActions.setToken, (state, { token, user }): AuthState => ({
    ...state,
    token,
    user,
    isAuthenticated: true,
  })),

  on(AuthActions.clearToken, (): AuthState => ({
    ...initialAuthState,
  })),

  // Forgot Password
  on(AuthActions.forgotPassword, (state): AuthState => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(AuthActions.forgotPasswordSuccess, (state): AuthState => ({
    ...state,
    isLoading: false,
    error: null,
  })),

  on(AuthActions.forgotPasswordFailure, (state, { error }): AuthState => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Reset Password
  on(AuthActions.resetPassword, (state): AuthState => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(AuthActions.resetPasswordSuccess, (state): AuthState => ({
    ...state,
    isLoading: false,
    error: null,
  })),

  on(AuthActions.resetPasswordFailure, (state, { error }): AuthState => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Clear Error
  on(AuthActions.clearError, (state): AuthState => ({
    ...state,
    error: null,
  }))
);
