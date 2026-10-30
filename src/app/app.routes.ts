import { inject } from '@angular/core';
import { Routes, Router, CanActivateFn } from '@angular/router';
import { Session } from './shared/infrastructure/api';
const guard: CanActivateFn = (route) => {
  const session = inject(Session),
    router = inject(Router);
  if (!session.user()) return router.createUrlTree(['/login']);
  return session.can(route.data['section']) || router.createUrlTree(['/' + session.firstRoute()]);
};
const guest: CanActivateFn = () => {
  const session = inject(Session);
  return !session.user() || inject(Router).createUrlTree(['/' + session.firstRoute()]);
};
export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guest],
    loadComponent: () => import('./iam/presentation/auth-page').then((m) => m.AuthPage),
  },
  {
    path: 'register',
    canActivate: [guest],
    data: { register: true },
    loadComponent: () => import('./iam/presentation/auth-page').then((m) => m.AuthPage),
  },
  {
    path: 'legal',
    loadComponent: () => import('./shared/presentation/legal-page').then((m) => m.LegalPage),
  },
  {
    path: 'inventory',
    data: { section: 'inventory' },
    canActivate: [guard],
    loadComponent: () =>
      import('./inventory/presentation/inventory-page').then((m) => m.InventoryPage),
  },
  {
    path: 'movements',
    data: { section: 'movements' },
    canActivate: [guard],
    loadComponent: () =>
      import('./inventory/presentation/inventory-page').then((m) => m.MovementPage),
  },
  {
    path: 'purchases',
    data: { section: 'purchases' },
    canActivate: [guard],
    loadComponent: () =>
      import('./procurement/presentation/purchasing-page').then((m) => m.PurchasingPage),
  },
  {
    path: 'sales',
    data: { section: 'sales' },
    canActivate: [guard],
    loadComponent: () => import('./sales/presentation/sales-page').then((m) => m.SalesPage),
  },
  {
    path: 'logistics',
    data: { section: 'logistics' },
    canActivate: [guard],
    loadComponent: () =>
      import('./logistics/presentation/logistics-page').then((m) => m.LogisticsPage),
  },
  {
    path: 'overview',
    data: { section: 'overview' },
    canActivate: [guard],
    loadComponent: () =>
      import('./reporting/presentation/overview-page').then((m) => m.OverviewPage),
  },
  {
    path: 'returns',
    data: { section: 'returns' },
    canActivate: [guard],
    loadComponent: () => import('./sales/presentation/returns-page').then((m) => m.ReturnsPage),
  },
  {
    path: 'team',
    data: { section: 'team' },
    canActivate: [guard],
    loadComponent: () => import('./iam/presentation/team-page').then((m) => m.TeamPage),
  },
  {
    path: 'notifications',
    data: { section: 'notifications' },
    canActivate: [guard],
    loadComponent: () =>
      import('./notifications/presentation/notifications-page').then((m) => m.NotificationsPage),
  },
  { path: 'reporting/dashboard', redirectTo: 'overview' },
  { path: 'inventory/products', redirectTo: 'inventory' },
  { path: 'sales/pos', redirectTo: 'sales' },
  { path: 'logistics/dispatches', redirectTo: 'logistics' },
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  { path: '**', redirectTo: 'overview' },
];
