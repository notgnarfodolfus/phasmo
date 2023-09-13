import { Routes } from '@angular/router';
import { IndexPageComponent } from './pages/index/index.component';

export const AppRoutes: Routes = [
  {
    path: '',
    component: IndexPageComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
