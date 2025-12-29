import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-skills',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page fade-in">
      <header class="page-header">
        <h1>Skills</h1>
        <p>Manage your technical skills</p>
      </header>
      <div class="glass-card placeholder-card">
        <span class="placeholder-icon">⚡</span>
        <h3>Skills Coming Soon</h3>
        <p>This page will display skills from your C# backend API.</p>
      </div>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 32px; }
    .page-header h1 { font-size: 2rem; margin-bottom: 8px; }
    .page-header p { color: var(--text-secondary); }
    .placeholder-card { padding: 60px; text-align: center; &:hover { transform: none; } }
    .placeholder-icon { font-size: 4rem; display: block; margin-bottom: 20px; }
    .placeholder-card h3 { margin-bottom: 8px; }
  `]
})
export class SkillsComponent {}
