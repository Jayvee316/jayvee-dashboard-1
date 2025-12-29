import { Component, signal, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="profile-page fade-in">
      <header class="page-header">
        <h1>Profile</h1>
        <p>Manage your personal information</p>
      </header>

      <div class="profile-grid">
        <!-- Profile Card -->
        <div class="profile-card glass-card">
          <div class="profile-banner"></div>
          <div class="profile-content">
            <div class="profile-avatar">
              <span>JV</span>
            </div>
            <h2>Jayvee Segundo</h2>
            <p class="profile-role">Full Stack Developer</p>
            <p class="profile-location">📍 Philippines</p>

            <div class="profile-stats">
              <div class="stat">
                <span class="stat-value">24</span>
                <span class="stat-label">Posts</span>
              </div>
              <div class="stat">
                <span class="stat-value">12</span>
                <span class="stat-label">Projects</span>
              </div>
              <div class="stat">
                <span class="stat-value">15</span>
                <span class="stat-label">Skills</span>
              </div>
            </div>

            <button class="glass-btn primary" style="width: 100%;">
              Edit Profile
            </button>
          </div>
        </div>

        <!-- Info Card -->
        <div class="info-card glass-card">
          <h3>Personal Information</h3>

          <div class="info-grid">
            <div class="info-item">
              <label>Full Name</label>
              <span>Jayvee Segundo</span>
            </div>
            <div class="info-item">
              <label>Email</label>
              <span>admin&#64;example.com</span>
            </div>
            <div class="info-item">
              <label>Phone</label>
              <span>+63 912 345 6789</span>
            </div>
            <div class="info-item">
              <label>Location</label>
              <span>Philippines</span>
            </div>
            <div class="info-item">
              <label>Website</label>
              <span>jayvee-portfolio.vercel.app</span>
            </div>
            <div class="info-item">
              <label>GitHub</label>
              <span>github.com/Jayvee316</span>
            </div>
          </div>
        </div>

        <!-- Bio Card -->
        <div class="bio-card glass-card">
          <h3>About Me</h3>
          <p>
            Passionate Full Stack Developer with expertise in Angular, TypeScript, and ASP.NET Core.
            I love building beautiful, performant web applications and continuously learning new technologies.
          </p>
          <p>
            Currently focused on creating portfolio projects to showcase my skills and help others learn
            web development through practical examples.
          </p>

          <div class="tech-stack">
            <h4>Tech Stack</h4>
            <div class="tech-tags">
              <span class="tag">Angular</span>
              <span class="tag">TypeScript</span>
              <span class="tag">C#</span>
              <span class="tag">ASP.NET Core</span>
              <span class="tag">PostgreSQL</span>
              <span class="tag">Node.js</span>
              <span class="tag">SCSS</span>
              <span class="tag">Git</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-page {
      max-width: 1200px;
    }

    .page-header {
      margin-bottom: 32px;

      h1 {
        font-size: 2rem;
        margin-bottom: 8px;
      }

      p {
        color: var(--text-secondary);
      }
    }

    .profile-grid {
      display: grid;
      grid-template-columns: 320px 1fr;
      grid-template-rows: auto auto;
      gap: 24px;
    }

    @media (max-width: 900px) {
      .profile-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Profile Card */
    .profile-card {
      grid-row: span 2;
      padding: 0;
      overflow: hidden;
      text-align: center;

      &:hover {
        transform: none;
      }
    }

    .profile-banner {
      height: 120px;
      background: var(--accent-gradient);
    }

    .profile-content {
      padding: 0 24px 24px;
    }

    .profile-avatar {
      width: 100px;
      height: 100px;
      background: var(--bg-secondary);
      border: 4px solid var(--bg-primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: 700;
      margin: -50px auto 16px;
      color: var(--accent-primary);
    }

    .profile-card h2 {
      font-size: 1.4rem;
      margin-bottom: 4px;
    }

    .profile-role {
      color: var(--accent-primary);
      font-weight: 500;
      margin-bottom: 4px;
    }

    .profile-location {
      color: var(--text-muted);
      font-size: 0.9rem;
      margin-bottom: 20px;
    }

    .profile-stats {
      display: flex;
      justify-content: center;
      gap: 32px;
      padding: 20px 0;
      border-top: 1px solid var(--glass-border);
      border-bottom: 1px solid var(--glass-border);
      margin-bottom: 20px;

      .stat {
        text-align: center;
      }

      .stat-value {
        display: block;
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text-primary);
      }

      .stat-label {
        font-size: 0.8rem;
        color: var(--text-muted);
      }
    }

    /* Info Card */
    .info-card {
      padding: 24px;

      &:hover {
        transform: none;
      }

      h3 {
        margin-bottom: 20px;
      }
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    @media (max-width: 600px) {
      .info-grid {
        grid-template-columns: 1fr;
      }
    }

    .info-item {
      label {
        display: block;
        font-size: 0.8rem;
        color: var(--text-muted);
        margin-bottom: 4px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      span {
        color: var(--text-primary);
        font-weight: 500;
      }
    }

    /* Bio Card */
    .bio-card {
      padding: 24px;

      &:hover {
        transform: none;
      }

      h3 {
        margin-bottom: 16px;
      }

      p {
        margin-bottom: 16px;
        line-height: 1.7;
      }
    }

    .tech-stack {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid var(--glass-border);

      h4 {
        font-size: 0.9rem;
        color: var(--text-secondary);
        margin-bottom: 12px;
      }
    }

    .tech-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .tag {
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 0.85rem;
      color: var(--text-secondary);
      transition: all var(--transition-fast);

      &:hover {
        border-color: var(--accent-primary);
        color: var(--accent-primary);
      }
    }
  `]
})
export class ProfileComponent {}
