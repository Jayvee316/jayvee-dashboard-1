import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

/**
 * Auth Interceptor - Adds JWT token to API requests
 *
 * Only adds token to requests going to our backend API.
 * Skips external APIs (GitHub, Node.js backend, etc.)
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Only add token to requests going to our C# backend API
  const isApiRequest = req.url.startsWith(environment.apiUrl);

  // Skip if no token, not our API, or auth endpoints
  if (!token || !isApiRequest || req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
    return next(req);
  }

  // Clone the request and add the Authorization header
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};
