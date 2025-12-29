import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PostService, Post } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-blog',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page fade-in">
      <header class="page-header">
        <div class="header-content">
          <div>
            <h1>Blog</h1>
            <p>Manage your blog posts</p>
          </div>
          <button class="glass-btn primary" (click)="openCreateModal()">
            <span>+ New Post</span>
          </button>
        </div>
      </header>

      <!-- Loading State -->
      @if (postService.loading()) {
        <div class="loading-container">
          <div class="spinner"></div>
          <p>Loading posts...</p>
        </div>
      }

      <!-- Error State -->
      @if (postService.error()) {
        <div class="error-message glass-card">
          <span>{{ postService.error() }}</span>
          <button class="glass-btn ghost" (click)="loadPosts()">Retry</button>
        </div>
      }

      <!-- Posts Grid -->
      @if (!postService.loading() && postService.posts().length > 0) {
        <div class="posts-grid">
          @for (post of postService.posts(); track post.id) {
            <article class="post-card glass-card">
              <div class="post-header">
                <h3 class="post-title">{{ post.title }}</h3>
                <div class="post-actions">
                  <button class="glass-btn icon-only ghost" title="Edit" (click)="openEditModal(post)">
                    <span>✏️</span>
                  </button>
                  <button class="glass-btn icon-only ghost" title="Delete" (click)="confirmDelete(post)">
                    <span>🗑️</span>
                  </button>
                </div>
              </div>
              <p class="post-body">{{ post.body }}</p>
              <div class="post-meta">
                <span class="post-id">Post #{{ post.id }}</span>
              </div>
            </article>
          }
        </div>
      }

      <!-- Empty State -->
      @if (!postService.loading() && postService.posts().length === 0 && !postService.error()) {
        <div class="glass-card empty-state">
          <span class="empty-icon">📝</span>
          <h3>No Posts Yet</h3>
          <p>Create your first blog post to get started.</p>
          <button class="glass-btn primary" (click)="openCreateModal()">Create Post</button>
        </div>
      }

      <!-- Create/Edit Modal -->
      @if (showModal()) {
        <div class="modal-overlay" (click)="closeModal()">
          <div class="modal glass-card" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>{{ editingPost() ? 'Edit Post' : 'Create New Post' }}</h2>
              <button class="glass-btn icon-only ghost" (click)="closeModal()">
                <span>✕</span>
              </button>
            </div>
            <form class="modal-form" (ngSubmit)="savePost()">
              <div class="form-group">
                <label for="title">Title</label>
                <input
                  type="text"
                  id="title"
                  class="glass-input"
                  [(ngModel)]="formTitle"
                  name="title"
                  placeholder="Enter post title"
                  required
                />
              </div>
              <div class="form-group">
                <label for="body">Content</label>
                <textarea
                  id="body"
                  class="glass-input"
                  [(ngModel)]="formBody"
                  name="body"
                  placeholder="Write your post content..."
                  rows="6"
                  required
                ></textarea>
              </div>
              <div class="modal-actions">
                <button type="button" class="glass-btn ghost" (click)="closeModal()">Cancel</button>
                <button type="submit" class="glass-btn primary" [disabled]="postService.loading()">
                  @if (postService.loading()) {
                    <span class="spinner" style="width: 16px; height: 16px; border-width: 2px;"></span>
                  } @else {
                    {{ editingPost() ? 'Update' : 'Create' }}
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Delete Confirmation Modal -->
      @if (showDeleteModal()) {
        <div class="modal-overlay" (click)="closeDeleteModal()">
          <div class="modal glass-card delete-modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>Delete Post</h2>
            </div>
            <p class="delete-message">Are you sure you want to delete "{{ deletingPost()?.title }}"? This action cannot be undone.</p>
            <div class="modal-actions">
              <button class="glass-btn ghost" (click)="closeDeleteModal()">Cancel</button>
              <button class="glass-btn danger" (click)="deletePost()" [disabled]="postService.loading()">
                @if (postService.loading()) {
                  <span class="spinner" style="width: 16px; height: 16px; border-width: 2px;"></span>
                } @else {
                  Delete
                }
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-header {
      margin-bottom: 32px;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }

    .page-header h1 {
      font-size: 2rem;
      margin-bottom: 8px;
    }

    .page-header p {
      color: var(--text-secondary);
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

    /* Error */
    .error-message {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: var(--error);

      &:hover {
        transform: none;
      }
    }

    /* Posts Grid */
    .posts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
    }

    .post-card {
      padding: 24px;
      display: flex;
      flex-direction: column;

      &:hover {
        transform: translateY(-2px);
      }
    }

    .post-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
      gap: 12px;
    }

    .post-title {
      font-size: 1.25rem;
      font-weight: 600;
      line-height: 1.3;
      flex: 1;
    }

    .post-actions {
      display: flex;
      gap: 4px;
      flex-shrink: 0;
    }

    .post-actions button {
      padding: 6px !important;
      font-size: 0.9rem;
      opacity: 0.6;

      &:hover {
        opacity: 1;
      }
    }

    .post-body {
      color: var(--text-secondary);
      line-height: 1.6;
      flex: 1;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
    }

    .post-meta {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid var(--glass-border);
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 60px;

      &:hover {
        transform: none;
      }
    }

    .empty-icon {
      font-size: 4rem;
      display: block;
      margin-bottom: 20px;
    }

    .empty-state h3 {
      margin-bottom: 8px;
    }

    .empty-state p {
      color: var(--text-secondary);
      margin-bottom: 24px;
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    }

    .modal {
      width: 100%;
      max-width: 500px;
      padding: 0;
      overflow: hidden;

      &:hover {
        transform: none;
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid var(--glass-border);

      h2 {
        font-size: 1.25rem;
        font-weight: 600;
      }
    }

    .modal-form {
      padding: 24px;
    }

    .form-group {
      margin-bottom: 20px;

      label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: var(--text-secondary);
      }

      textarea {
        resize: vertical;
        min-height: 120px;
      }
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 20px 24px;
      border-top: 1px solid var(--glass-border);
      background: var(--glass-bg);
    }

    /* Delete Modal */
    .delete-modal {
      max-width: 400px;
    }

    .delete-message {
      padding: 24px;
      color: var(--text-secondary);
      line-height: 1.6;
    }

    .glass-btn.danger {
      background: linear-gradient(135deg, #ef4444, #dc2626);
      border-color: rgba(239, 68, 68, 0.3);

      &:hover {
        box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
      }
    }
  `]
})
export class BlogComponent implements OnInit {
  postService = inject(PostService);
  private authService = inject(AuthService);

  // Modal state
  showModal = signal(false);
  showDeleteModal = signal(false);
  editingPost = signal<Post | null>(null);
  deletingPost = signal<Post | null>(null);

  // Form fields
  formTitle = '';
  formBody = '';

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.postService.getPosts().subscribe();
  }

  openCreateModal() {
    this.editingPost.set(null);
    this.formTitle = '';
    this.formBody = '';
    this.showModal.set(true);
  }

  openEditModal(post: Post) {
    this.editingPost.set(post);
    this.formTitle = post.title;
    this.formBody = post.body;
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.editingPost.set(null);
    this.formTitle = '';
    this.formBody = '';
  }

  savePost() {
    if (!this.formTitle.trim() || !this.formBody.trim()) return;

    const editing = this.editingPost();

    if (editing) {
      // Update existing post
      this.postService.updatePost(editing.id, {
        title: this.formTitle,
        body: this.formBody
      }).subscribe(success => {
        if (success !== false) {
          this.closeModal();
        }
      });
    } else {
      // Create new post
      this.postService.createPost({
        title: this.formTitle,
        body: this.formBody
      }).subscribe(post => {
        if (post) {
          this.closeModal();
        }
      });
    }
  }

  confirmDelete(post: Post) {
    this.deletingPost.set(post);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.deletingPost.set(null);
  }

  deletePost() {
    const post = this.deletingPost();
    if (!post) return;

    this.postService.deletePost(post.id).subscribe(success => {
      if (success !== false) {
        this.closeDeleteModal();
      }
    });
  }
}
