import { Component, signal, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface NavItem {
  icon: string;
  label: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" [class.collapsed]="isCollapsed()">
      <!-- Logo Section -->
      <div class="sidebar-header">
        <div class="logo">
          <span class="logo-icon">JD</span>
          @if (!isCollapsed()) {
            <span class="logo-text">Jayvee<span class="text-gradient">Dashboard</span></span>
          }
        </div>
        <button class="collapse-btn glass-btn icon-only" (click)="toggleSidebar()">
          <span class="icon">{{ isCollapsed() ? '→' : '←' }}</span>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <ul class="nav-list">
          @for (item of navItems(); track item.route) {
            <li class="nav-item">
              <a
                [routerLink]="item.route"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
                class="nav-link"
                [title]="isCollapsed() ? item.label : ''"
              >
                <span class="nav-icon">{{ item.icon }}</span>
                @if (!isCollapsed()) {
                  <span class="nav-label">{{ item.label }}</span>
                  @if (item.badge) {
                    <span class="nav-badge">{{ item.badge }}</span>
                  }
                }
              </a>
            </li>
          }
        </ul>
      </nav>

      <!-- User Section -->
      <div class="sidebar-footer">
        <div class="user-card glass-card">
          <div class="user-avatar">
            <span>{{ userInitials() }}</span>
          </div>
          @if (!isCollapsed()) {
            <div class="user-info">
              <span class="user-name">{{ userName() }}</span>
              <span class="user-role">{{ userRole() }}</span>
            </div>
            <button class="logout-btn glass-btn icon-only" title="Logout" (click)="logout()">
              <span>⏻</span>
            </button>
          }
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      width: var(--sidebar-width);
      background: var(--glass-bg);
      backdrop-filter: var(--glass-blur);
      -webkit-backdrop-filter: var(--glass-blur);
      border-right: 1px solid var(--glass-border);
      display: flex;
      flex-direction: column;
      transition: width var(--transition-normal);
      z-index: 100;

      &.collapsed {
        width: var(--sidebar-collapsed-width);

        .sidebar-header {
          justify-content: center;
          padding: 20px 10px;
        }

        .logo-icon {
          margin-right: 0;
        }

        .collapse-btn {
          position: absolute;
          right: -15px;
          top: 25px;
        }

        .nav-link {
          justify-content: center;
          padding: 14px;
        }

        .nav-icon {
          margin-right: 0;
        }

        .user-card {
          justify-content: center;
          padding: 12px;
        }

        .user-avatar {
          margin-right: 0;
        }
      }
    }

    /* Header */
    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px;
      border-bottom: 1px solid var(--glass-border);
    }

    .logo {
      display: flex;
      align-items: center;
    }

    .logo-icon {
      width: 40px;
      height: 40px;
      background: var(--accent-gradient);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1rem;
      margin-right: 12px;
      box-shadow: var(--accent-glow);
    }

    .logo-text {
      font-size: 1.1rem;
      font-weight: 600;
      white-space: nowrap;
    }

    .collapse-btn {
      padding: 8px !important;
      font-size: 0.8rem;
    }

    /* Navigation */
    .sidebar-nav {
      flex: 1;
      padding: 20px 12px;
      overflow-y: auto;
    }

    .nav-list {
      list-style: none;
    }

    .nav-item {
      margin-bottom: 8px;
    }

    .nav-link {
      display: flex;
      align-items: center;
      padding: 14px 16px;
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      text-decoration: none;
      transition: all var(--transition-normal);
      position: relative;

      &:hover {
        background: var(--glass-bg);
        color: var(--text-primary);
      }

      &.active {
        background: var(--accent-gradient);
        color: var(--text-primary);
        box-shadow: var(--accent-glow);

        .nav-icon {
          transform: scale(1.1);
        }
      }
    }

    .nav-icon {
      font-size: 1.25rem;
      margin-right: 14px;
      transition: transform var(--transition-fast);
    }

    .nav-label {
      font-weight: 500;
      white-space: nowrap;
    }

    .nav-badge {
      margin-left: auto;
      background: var(--error);
      color: white;
      font-size: 0.7rem;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 10px;
    }

    /* Footer / User Section */
    .sidebar-footer {
      padding: 16px 12px;
      border-top: 1px solid var(--glass-border);
    }

    .user-card {
      display: flex;
      align-items: center;
      padding: 12px 16px;

      &:hover {
        transform: none;
      }
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      background: var(--accent-gradient);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.9rem;
      margin-right: 12px;
      flex-shrink: 0;
    }

    .user-info {
      flex: 1;
      min-width: 0;
    }

    .user-name {
      display: block;
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--text-primary);
    }

    .user-role {
      display: block;
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .logout-btn {
      padding: 8px !important;
      font-size: 1rem;
      opacity: 0.7;

      &:hover {
        opacity: 1;
        color: var(--error);
      }
    }

    .icon {
      display: inline-block;
    }
  `]
})
export class SidebarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isCollapsed = signal(false);

  navItems = signal<NavItem[]>([
    { icon: '🏠', label: 'Dashboard', route: '/dashboard' },
    { icon: '👤', label: 'Profile', route: '/profile' },
    { icon: '📝', label: 'Blog', route: '/blog', badge: 3 },
    { icon: '📁', label: 'Projects', route: '/projects' },
    { icon: '⚡', label: 'Skills', route: '/skills' },
    { icon: '📬', label: 'Messages', route: '/messages', badge: 5 },
    { icon: '⚙️', label: 'Settings', route: '/settings' },
  ]);

  // Computed properties from AuthService
  userName = computed(() => this.authService.currentUser()?.name || 'Guest');
  userRole = computed(() => {
    const role = this.authService.currentUser()?.role || 'user';
    return role.charAt(0).toUpperCase() + role.slice(1);
  });
  userInitials = computed(() => {
    const name = this.authService.currentUser()?.name || 'G';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  });

  toggleSidebar() {
    this.isCollapsed.update(v => !v);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
