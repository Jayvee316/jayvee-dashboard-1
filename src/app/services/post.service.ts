import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, map } from 'rxjs';
import { environment } from '../../environments/environment';

// Interfaces matching the C# DTOs
export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export interface CreatePostRequest {
  title: string;
  body: string;
}

export interface UpdatePostRequest {
  title: string;
  body: string;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/posts`;

  // Reactive state
  posts = signal<Post[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  /**
   * Get all posts
   */
  getPosts(): Observable<Post[]> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<Post[]>(this.apiUrl).pipe(
      tap(posts => {
        this.posts.set(posts);
        this.loading.set(false);
      }),
      catchError(err => {
        this.error.set('Failed to load posts');
        this.loading.set(false);
        console.error('Error fetching posts:', err);
        return of([]);
      })
    );
  }

  /**
   * Get a single post by ID
   */
  getPost(id: number): Observable<Post | null> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`).pipe(
      catchError(err => {
        console.error('Error fetching post:', err);
        return of(null);
      })
    );
  }

  /**
   * Create a new post (requires authentication)
   */
  createPost(request: CreatePostRequest): Observable<Post | null> {
    this.loading.set(true);

    return this.http.post<Post>(this.apiUrl, request).pipe(
      tap(post => {
        // Add new post to the beginning of the list
        this.posts.update(posts => [post, ...posts]);
        this.loading.set(false);
      }),
      catchError(err => {
        this.error.set('Failed to create post');
        this.loading.set(false);
        console.error('Error creating post:', err);
        return of(null);
      })
    );
  }

  /**
   * Update an existing post (requires authentication)
   */
  updatePost(id: number, request: UpdatePostRequest): Observable<boolean> {
    this.loading.set(true);

    return this.http.put(`${this.apiUrl}/${id}`, request).pipe(
      map(() => {
        // Update the post in the local list
        this.posts.update(posts =>
          posts.map(p => p.id === id ? { ...p, ...request } : p)
        );
        this.loading.set(false);
        return true;
      }),
      catchError(err => {
        this.error.set('Failed to update post');
        this.loading.set(false);
        console.error('Error updating post:', err);
        return of(false);
      })
    );
  }

  /**
   * Delete a post (requires authentication)
   */
  deletePost(id: number): Observable<boolean> {
    this.loading.set(true);

    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      map(() => {
        // Remove post from local list
        this.posts.update(posts => posts.filter(p => p.id !== id));
        this.loading.set(false);
        return true;
      }),
      catchError(err => {
        this.error.set('Failed to delete post');
        this.loading.set(false);
        console.error('Error deleting post:', err);
        return of(false);
      })
    );
  }
}
