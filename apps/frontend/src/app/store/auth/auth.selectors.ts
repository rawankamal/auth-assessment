import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

// Feature selector
export const selectAuthState = createFeatureSelector<AuthState>('auth');

// Auth selectors
export const selectUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);

export const selectToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.token
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => state.isAuthenticated
);

export const selectIsLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.isLoading
);

export const selectError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);

// Composite selectors
export const selectUserInfo = createSelector(
  selectUser,
  selectIsAuthenticated,
  (user, isAuthenticated) => {
    if (!isAuthenticated || !user) return null;

    return {
      ...user,
      loginTime: user.loginTime || new Date().toLocaleString(),
    };
  }
);

export const selectAuthLoading = createSelector(
  selectIsLoading,
  (isLoading) => isLoading
);

export const selectAuthError = createSelector(
  selectError,
  (error) => error
);
