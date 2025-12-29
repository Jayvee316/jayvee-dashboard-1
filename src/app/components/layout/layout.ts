import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="layout">
      <app-sidebar />
      <main class="main-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .layout {
      display: flex;
      min-height: 100vh;
    }

    .main-content {
      flex: 1;
      margin-left: var(--sidebar-width);
      padding: 32px;
      transition: margin-left var(--transition-normal);
      min-height: 100vh;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .main-content {
        margin-left: 0;
        padding: 16px;
      }
    }
  `]
})
export class LayoutComponent {}
