import { Routes } from '@angular/router';
import { SelectorComponent } from './pages/selector/selector.component';

export const AppRoutes: Routes = [
  {
    path: 'selector',
    component: SelectorComponent
  },
  {
    path: '**',
    redirectTo: '/selector'
  }
];