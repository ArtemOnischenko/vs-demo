import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: '',
    loadComponent: () => import('./features/pages/posts-page/posts-page.component').then((m) => m.PostsPageComponent)
  },
];
