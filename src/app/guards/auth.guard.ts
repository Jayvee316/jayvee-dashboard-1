import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Auth Guard - Protects routes that require authentication
 *
 * Redirects to login page if user is not authenticated or token is expired.
 * Stores the attempted URL to redirect back after login.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is authenticated and token is not expired
  if (authService.isAuthenticated() && !authService.isTokenExpired()) {
    return true;
  }

  // Not authenticated - redirect to login with return URL
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });

  return false;
};

/**
 * Admin Guard - Protects routes that require admin role
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // First check if authenticated
  if (!authService.isAuthenticated() || authService.isTokenExpired()) {
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  // Then check if admin
  if (authService.isAdmin()) {
    return true;
  }

  // Not admin - redirect to dashboard
  router.navigate(['/dashboard']);
  return false;
};

/**
 * Guest Guard - Prevents authenticated users from accessing login/register
 */
export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && !authService.isTokenExpired()) {
    // Already logged in - redirect to dashboard
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
