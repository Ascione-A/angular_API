import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { NewPost, Post } from '../models/post';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://jsonplaceholder.typicode.com/posts';
  private readonly postsState = signal<Post[]>([]);

  readonly posts = this.postsState.asReadonly();

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl).pipe(tap((posts) => this.postsState.set(posts)));
  }

  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }

  createPost(post: NewPost): Observable<Post> {
    return this.http
      .post<Post>(this.apiUrl, post)
      .pipe(
        tap((createdPost) =>
          this.postsState.update((posts) => [{ ...createdPost, createdLocally: true }, ...posts]),
        ),
      );
  }
}
