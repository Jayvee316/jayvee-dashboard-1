import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Public route - Login (no sidebar)
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent),
    canActivate: [guestGuard]  // Redirect to dashboard if already logged in
  },

  // Protected routes with sidebar layout
  {
    path: '',
    loadComponent: () => import('./components/layout/layout').then(m => m.LayoutComponent),
    canActivate: [authGuard],  // Require authentication
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile').then(m => m.ProfileComponent)
      },
      {
        path: 'blog',
        loadComponent: () => import('./pages/blog/blog').then(m => m.BlogComponent)
      },
      {
        path: 'projects',
        loadComponent: () => import('./pages/projects/projects').then(m => m.ProjectsComponent)
      },
      {
        path: 'skills',
        loadComponent: () => import('./pages/skills/skills').then(m => m.SkillsComponent)
      },
      {
        path: 'messages',
        loadComponent: () => import('./pages/messages/messages').then(m => m.MessagesComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings').then(m => m.SettingsComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // Fallback - redirect to login (guard will handle redirect to dashboard if logged in)
  { path: '**', redirectTo: 'login' }
];
