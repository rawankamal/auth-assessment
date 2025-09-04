import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

import { LoginComponent } from './login/login';
import { SignupComponent } from './signup/signup';
import { DashboardComponent } from './dashboard/dashboard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]   // 🟢 هنا التغيير المهم
  }
];

export const AppRouting = provideRouter(routes);
