import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { apiErrorMessage } from '../../utils/api-error-message';
import { PostsService } from '../../services/posts.service';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-posts-page',
  styleUrl: './posts-page.css',
  templateUrl: './posts-page.html',
})
export class PostsPage implements OnInit {
  private readonly postsService = inject(PostsService);

  readonly posts = this.postsService.posts;
  readonly loading = signal(true);
  readonly posting = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');
  readonly postCount = computed(() => this.posts().length);
  readonly visiblePosts = computed(() => {
    const query = this.filter().trim().toLocaleLowerCase();
    return this.posts().filter(
      (post) =>
        post.title.toLocaleLowerCase().includes(query) ||
        post.body.toLocaleLowerCase().includes(query),
    );
  });

  draftTitle = '';
  draftBody = '';

  ngOnInit(): void {
    this.loadPosts();
  }

  setFilter(event: Event): void {
    if (event.target instanceof HTMLInputElement) {
      this.filter.set(event.target.value);
    }
  }

  createPost(): void {
    const title = this.draftTitle.trim();
    const body = this.draftBody.trim();
    if (!title || !body || this.posting()) {
      return;
    }

    this.error.set(null);
    this.posting.set(true);
    this.postsService.createPost({ userId: 1, title, body }).subscribe({
      next: () => {
        this.draftTitle = '';
        this.draftBody = '';
      },
      error: (error: unknown) => {
        this.error.set(apiErrorMessage(error));
        this.posting.set(false);
      },
      complete: () => this.posting.set(false),
    });
  }

  private loadPosts(): void {
    this.loading.set(true);
    this.error.set(null);
    this.postsService.getPosts().subscribe({
      error: (error: unknown) => {
        this.error.set(apiErrorMessage(error));
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }
}
