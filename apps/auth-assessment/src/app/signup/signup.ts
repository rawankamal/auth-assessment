import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

import { AppState } from '../store/app.state';
import { signup, clearError } from '../store/auth/auth.actions';
import { selectIsLoading, selectError } from '../store/auth/auth.selectors';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'],
})
export class SignupComponent implements OnDestroy {
  signupForm;

  // NgRx Observables
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;

  private destroy$ = new Subject<void>();
  private fb = inject(FormBuilder);
  private store = inject(Store<AppState>);
  private router = inject(Router);

  constructor() {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    // Subscribe to NgRx state
    this.isLoading$ = this.store.select(selectIsLoading);
    this.error$ = this.store.select(selectError);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    if (this.signupForm.invalid) return;

    const { name, email, password } = this.signupForm.value;

    // Clear any previous errors
    this.store.dispatch(clearError());

    // Dispatch signup action
    this.store.dispatch(signup({ name: name!, email: email!, password: password! }));
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  clearErrorMessage() {
    this.store.dispatch(clearError());
  }
}
