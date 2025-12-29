import { Component, signal, OnInit, inject, ChangeDetectionStrategy, computed } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { forkJoin, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { Post, PostService } from '../../services/post.service';

interface StatCard {
  icon: string;
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

interface GitHubProfile {
  login: string;
  name: string;
  avatarUrl: string;
  bio: string;
  publicRepos: number;
  followers: number;
  following: number;
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  htmlUrl: string;
  language: string;
  stargazersCount: number;
  forksCount: number;
  updatedAt: string;
}

interface Activity {
  id: number;
  icon: string;
  text: string;
  time: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dashboard fade-in">
      <!-- Header -->
      <header class="page-header">
        <div>
          <h1>Welcome back, <span class="text-gradient">{{ userName() }}</span></h1>
          <p>Here's what's happening with your portfolio today.</p>
        </div>
        <div class="header-date">
          <span class="date">{{ today | date:'EEEE, MMMM d, y' }}</span>
        </div>
      </header>

      <!-- Loading State -->
      @if (loading()) {
        <div class="loading-container">
          <div class="spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      }

      <!-- Stats Grid -->
      @if (!loading()) {
        <section class="stats-grid">
          @for (stat of stats(); track stat.label) {
            <div class="stat-card glass-card">
              <div class="stat-icon">{{ stat.icon }}</div>
              <div class="stat-content">
                <span class="stat-value">{{ stat.value }}</span>
                <span class="stat-label">{{ stat.label }}</span>
              </div>
              @if (stat.change && stat.trend) {
                <div class="stat-change" [class]="stat.trend">
                  {{ stat.trend === 'up' ? '↑' : stat.trend === 'down' ? '↓' : '•' }} {{ stat.change }}
                </div>
              }
            </div>
          }
        </section>

        <!-- Content Grid -->
        <section class="content-grid">
          <!-- Recent Posts -->
          <div class="activity-card glass-card">
            <div class="card-header">
              <h3>Recent Blog Posts</h3>
              <button class="glass-btn ghost small" (click)="goToBlog()">View All</button>
            </div>
            @if (recentPosts().length > 0) {
              <ul class="activity-list">
                @for (post of recentPosts(); track post.id) {
                  <li class="activity-item">
                    <span class="activity-icon">📝</span>
                    <div class="activity-content">
                      <span class="activity-text">{{ post.title }}</span>
                      <span class="activity-time">Post #{{ post.id }}</span>
                    </div>
                  </li>
                }
              </ul>
            } @else {
              <div class="empty-state">
                <p>No blog posts yet. Create your first post!</p>
              </div>
            }
          </div>

          <!-- Quick Actions -->
          <div class="actions-card glass-card">
            <h3>Quick Actions</h3>
            <div class="actions-grid">
              <button class="action-btn glass-btn" (click)="goToBlog()">
                <span>📝</span>
                <span>New Post</span>
              </button>
              <button class="action-btn glass-btn" (click)="goToProjects()">
                <span>📁</span>
                <span>Projects</span>
              </button>
              <button class="action-btn glass-btn" (click)="goToProfile()">
                <span>👤</span>
                <span>Profile</span>
              </button>
              <button class="action-btn glass-btn" (click)="goToSettings()">
                <span>⚙️</span>
                <span>Settings</span>
              </button>
            </div>
          </div>
        </section>

        <!-- GitHub Section -->
        @if (githubProfile()) {
          <section class="github-section">
            <h3>GitHub Overview</h3>
            <div class="github-grid">
              <!-- GitHub Profile Card -->
              <div class="github-profile glass-card">
                <img [src]="githubProfile()?.avatarUrl" [alt]="githubProfile()?.name" class="github-avatar" />
                <div class="github-info">
                  <h4>{{ githubProfile()?.name || githubProfile()?.login }}</h4>
                  <p class="github-bio">{{ githubProfile()?.bio || 'No bio available' }}</p>
                  <div class="github-stats">
                    <span><strong>{{ githubProfile()?.publicRepos }}</strong> repos</span>
                    <span><strong>{{ githubProfile()?.followers }}</strong> followers</span>
                    <span><strong>{{ githubProfile()?.following }}</strong> following</span>
                  </div>
                </div>
              </div>

              <!-- Recent Repos -->
              <div class="github-repos glass-card">
                <h4>Recent Repositories</h4>
                @if (recentRepos().length > 0) {
                  <ul class="repos-list">
                    @for (repo of recentRepos(); track repo.id) {
                      <li class="repo-item">
                        <a [href]="repo.htmlUrl" target="_blank" class="repo-link">
                          <span class="repo-name">{{ repo.name }}</span>
                          @if (repo.language) {
                            <span class="repo-lang">{{ repo.language }}</span>
                          }
                        </a>
                        <div class="repo-stats">
                          <span>⭐ {{ repo.stargazersCount }}</span>
                          <span>🍴 {{ repo.forksCount }}</span>
                        </div>
                      </li>
                    }
                  </ul>
                } @else {
                  <p class="empty-state">No repositories found</p>
                }
              </div>
            </div>
          </section>
        }
      }
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1400px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
      flex-wrap: wrap;
      gap: 16px;

      h1 {
        font-size: 2rem;
        margin-bottom: 8px;
      }

      p {
        color: var(--text-secondary);
      }
    }

    .header-date {
      text-align: right;

      .date {
        color: var(--text-secondary);
        font-size: 0.9rem;
      }
    }

    /* Loading */
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 60px;
      color: var(--text-secondary);
    }

    .loading-container .spinner {
      margin-bottom: 16px;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .stat-card {
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-icon {
      font-size: 2rem;
      width: 56px;
      height: 56px;
      background: var(--glass-bg);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-content {
      flex: 1;
    }

    .stat-value {
      display: block;
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .stat-label {
      display: block;
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    .stat-change {
      font-size: 0.85rem;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 20px;

      &.up {
        background: rgba(16, 185, 129, 0.2);
        color: var(--success);
      }

      &.down {
        background: rgba(239, 68, 68, 0.2);
        color: var(--error);
      }

      &.neutral {
        background: var(--glass-bg);
        color: var(--text-muted);
      }
    }

    /* Content Grid */
    .content-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
      margin-bottom: 32px;
    }

    @media (max-width: 1024px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }

    .activity-card,
    .actions-card {
      padding: 24px;

      h3 {
        margin-bottom: 20px;
        font-size: 1.1rem;
      }
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h3 {
        margin-bottom: 0;
      }
    }

    .glass-btn.small {
      padding: 6px 12px !important;
      font-size: 0.8rem;
    }

    /* Activity List */
    .activity-list {
      list-style: none;
    }

    .activity-item {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 14px 0;
      border-bottom: 1px solid var(--glass-border);

      &:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }

      &:first-child {
        padding-top: 0;
      }
    }

    .activity-icon {
      font-size: 1.25rem;
      width: 36px;
      height: 36px;
      background: var(--glass-bg);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .activity-content {
      flex: 1;
    }

    .activity-text {
      display: block;
      color: var(--text-primary);
      font-size: 0.9rem;
      margin-bottom: 4px;
    }

    .activity-time {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    /* Quick Actions */
    .actions-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .action-btn {
      flex-direction: column;
      padding: 20px !important;
      gap: 10px;

      span:first-child {
        font-size: 1.5rem;
      }

      span:last-child {
        font-size: 0.85rem;
      }
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 20px;
      color: var(--text-muted);
    }

    /* GitHub Section */
    .github-section {
      h3 {
        font-size: 1.25rem;
        margin-bottom: 20px;
      }
    }

    .github-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    @media (max-width: 900px) {
      .github-grid {
        grid-template-columns: 1fr;
      }
    }

    .github-profile {
      padding: 24px;
      display: flex;
      gap: 20px;
      align-items: flex-start;
    }

    .github-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .github-info {
      flex: 1;

      h4 {
        font-size: 1.1rem;
        margin-bottom: 8px;
      }
    }

    .github-bio {
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin-bottom: 12px;
      line-height: 1.4;
    }

    .github-stats {
      display: flex;
      gap: 16px;
      font-size: 0.85rem;
      color: var(--text-muted);

      strong {
        color: var(--text-primary);
      }
    }

    .github-repos {
      padding: 24px;

      h4 {
        font-size: 1rem;
        margin-bottom: 16px;
      }
    }

    .repos-list {
      list-style: none;
    }

    .repo-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid var(--glass-border);

      &:last-child {
        border-bottom: none;
      }

      &:first-child {
        padding-top: 0;
      }
    }

    .repo-link {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--text-primary);
      text-decoration: none;

      &:hover .repo-name {
        color: var(--accent-primary);
      }
    }

    .repo-name {
      font-weight: 500;
      transition: color var(--transition-fast);
    }

    .repo-lang {
      font-size: 0.75rem;
      padding: 2px 8px;
      background: var(--glass-bg);
      border-radius: 10px;
      color: var(--text-muted);
    }

    .repo-stats {
      display: flex;
      gap: 12px;
      font-size: 0.8rem;
      color: var(--text-muted);
    }
  `]
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);
  private postService = inject(PostService);

  today = new Date();
  loading = signal(true);

  // User info from AuthService
  userName = computed(() => this.authService.currentUser()?.name || 'User');

  // Dashboard data
  stats = signal<StatCard[]>([]);
  recentPosts = signal<Post[]>([]);
  githubProfile = signal<GitHubProfile | null>(null);
  recentRepos = signal<GitHubRepo[]>([]);

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading.set(true);

    // Fetch all data in parallel
    forkJoin({
      posts: this.http.get<Post[]>(`${environment.apiUrl}/posts`).pipe(catchError(() => of([]))),
      githubProfile: this.http.get<GitHubProfile>(`${environment.apiUrl}/github-profile`).pipe(catchError(() => of(null))),
      githubRepos: this.http.get<GitHubRepo[]>(`${environment.apiUrl}/github-repos`).pipe(catchError(() => of([])))
    }).subscribe(({ posts, githubProfile, githubRepos }) => {
      // Update stats
      this.stats.set([
        { icon: '📝', label: 'Blog Posts', value: posts.length },
        { icon: '📦', label: 'GitHub Repos', value: githubProfile?.publicRepos || githubRepos.length },
        { icon: '⭐', label: 'Total Stars', value: githubRepos.reduce((sum, r) => sum + r.stargazersCount, 0) },
        { icon: '👥', label: 'Followers', value: githubProfile?.followers || 0 },
      ]);

      // Update recent posts (last 5)
      this.recentPosts.set(posts.slice(0, 5));

      // Update GitHub data
      this.githubProfile.set(githubProfile);
      this.recentRepos.set(githubRepos.slice(0, 5));

      this.loading.set(false);
    });
  }

  goToBlog() {
    this.router.navigate(['/blog']);
  }

  goToProjects() {
    this.router.navigate(['/projects']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }
}
