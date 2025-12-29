import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="login-page">
      <!-- Background Effects -->
      <div class="bg-effects">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
      </div>

      <!-- Login Card -->
      <div class="login-card glass-card fade-in">
        <div class="login-header">
          <div class="logo">
            <span class="logo-icon">JD</span>
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to your dashboard</p>
        </div>

        <form class="login-form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              class="glass-input"
              placeholder="admin@example.com"
              [(ngModel)]="email"
              name="email"
              required
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              class="glass-input"
              placeholder="••••••••"
              [(ngModel)]="password"
              name="password"
              required
            />
          </div>

          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="rememberMe" name="rememberMe" />
              <span>Remember me</span>
            </label>
            <a href="#" class="forgot-link">Forgot password?</a>
          </div>

          @if (errorMessage()) {
            <div class="error-message">
              {{ errorMessage() }}
            </div>
          }

          <button type="submit" class="glass-btn primary submit-btn" [disabled]="isLoading()">
            @if (isLoading()) {
              <span class="spinner" style="width: 20px; height: 20px; border-width: 2px;"></span>
            } @else {
              Sign In
            }
          </button>
        </form>

        <div class="login-footer">
          <p>Test credentials: <strong>admin&#64;example.com</strong> / <strong>admin123</strong></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      position: relative;
      overflow: hidden;
    }

    /* Background Orbs */
    .bg-effects {
      position: absolute;
      inset: 0;
      overflow: hidden;
      z-index: 0;
    }

    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.5;
      animation: float 20s ease-in-out infinite;
    }

    .orb-1 {
      width: 400px;
      height: 400px;
      background: var(--accent-primary);
      top: -100px;
      right: -100px;
      animation-delay: 0s;
    }

    .orb-2 {
      width: 300px;
      height: 300px;
      background: var(--accent-secondary);
      bottom: -50px;
      left: -50px;
      animation-delay: -5s;
    }

    .orb-3 {
      width: 200px;
      height: 200px;
      background: var(--info);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation-delay: -10s;
    }

    @keyframes float {
      0%, 100% { transform: translate(0, 0) scale(1); }
      25% { transform: translate(20px, -20px) scale(1.05); }
      50% { transform: translate(-10px, 20px) scale(0.95); }
      75% { transform: translate(-20px, -10px) scale(1.02); }
    }

    /* Login Card */
    .login-card {
      width: 100%;
      max-width: 420px;
      padding: 40px;
      position: relative;
      z-index: 1;

      &:hover {
        transform: none;
      }
    }

    .login-header {
      text-align: center;
      margin-bottom: 32px;

      .logo {
        margin-bottom: 20px;
      }

      .logo-icon {
        display: inline-flex;
        width: 56px;
        height: 56px;
        background: var(--accent-gradient);
        border-radius: var(--radius-lg);
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 1.25rem;
        box-shadow: var(--accent-glow);
      }

      h1 {
        font-size: 1.75rem;
        margin-bottom: 8px;
      }

      p {
        color: var(--text-muted);
      }
    }

    /* Form */
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;

      label {
        font-size: 0.9rem;
        font-weight: 500;
        color: var(--text-secondary);
      }
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.85rem;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      color: var(--text-secondary);

      input {
        width: 16px;
        height: 16px;
        accent-color: var(--accent-primary);
      }
    }

    .forgot-link {
      color: var(--accent-primary);

      &:hover {
        text-decoration: underline;
      }
    }

    .error-message {
      background: rgba(239, 68, 68, 0.2);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: var(--error);
      padding: 12px 16px;
      border-radius: var(--radius-md);
      font-size: 0.9rem;
      text-align: center;
    }

    .submit-btn {
      width: 100%;
      padding: 16px !important;
      font-size: 1rem;
      margin-top: 8px;
    }

    /* Footer */
    .login-footer {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid var(--glass-border);
      text-align: center;

      p {
        font-size: 0.8rem;
        color: var(--text-muted);

        strong {
          color: var(--text-secondary);
        }
      }
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  email = '';
  password = '';
  rememberMe = false;
  isLoading = signal(false);
  errorMessage = signal('');

  onSubmit() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response) {
          // Redirect to return URL or dashboard
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
          this.router.navigateByUrl(returnUrl);
        } else {
          this.errorMessage.set('Invalid email or password');
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Login failed. Please try again.');
      }
    });
  }
}
