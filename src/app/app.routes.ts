import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'pokedex',
    loadComponent: () =>
      import('./pages/layout/layout.page').then((m) => m.LayoutPage),
  },
  {
    path: 'pokedex/:id',
    loadComponent: () =>
      import('./pages/detail/detail.page').then((m) => m.DetailPage),
  },
  {
    path: '',
    redirectTo: 'pokedex',
    pathMatch: 'full',
  },
];
