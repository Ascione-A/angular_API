import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PostsService } from '../../services/posts.service';
import { Post } from '../../models/post';
import { apiErrorMessage } from '../../utils/api-error-message';

@Component({
  imports: [RouterLink],
  selector: 'app-post-detail-page',
  styleUrl: './post-detail-page.css',
  templateUrl: './post-detail-page.html',
})
export class PostDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly postsService = inject(PostsService);

  readonly post = signal<Post | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      this.post.set(null);
      this.error.set(null);
      this.loading.set(true);

      if (!Number.isInteger(id) || id < 1) {
        this.error.set('Post non trovato (errore 404).');
        this.loading.set(false);
        return;
      }

      this.postsService.getPost(id).subscribe({
        next: (post) => this.post.set(post),
        error: (error: unknown) => {
          this.error.set(apiErrorMessage(error));
          this.loading.set(false);
        },
        complete: () => this.loading.set(false),
      });
    });
  }

  goToPrevious(): void {
    const id = this.post()?.id;
    if (id && id > 1) {
      void this.navigateTo(id - 1);
    }
  }

  goToNext(): void {
    const id = this.post()?.id;
    if (id && id < 100) {
      void this.navigateTo(id + 1);
    }
  }

  canGoPrevious(): boolean {
    return (this.post()?.id ?? 1) > 1;
  }

  canGoNext(): boolean {
    return (this.post()?.id ?? 100) < 100;
  }

  private navigateTo(id: number): void {
    void this.router.navigate(['/posts', id]);
  }
}
