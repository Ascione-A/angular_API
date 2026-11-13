import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'posts',
    loadComponent: () => import('./pages/posts-page/posts-page').then((module) => module.PostsPage),
  },
  {
    path: 'posts/:id',
    loadComponent: () =>
      import('./pages/post-detail-page/post-detail-page').then((module) => module.PostDetailPage),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'posts',
  },
  {
    path: '**',
    redirectTo: 'posts',
  },
];
