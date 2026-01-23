import { Routes } from '@angular/router';
import { RoleGuard } from './auth/guards/role.guard';

export const routes: Routes = [

  {
    path: '',
    loadComponent: () =>
      import('./auth/role-login/role-login')
        .then(m => m.RoleLoginComponent),
    pathMatch: 'full',
  },

  {
    path: 'dashboard',
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'customer'] },
    loadComponent: () =>
      import('./pages/dashboard/dashboard')
        .then(m => m.DashboardComponent),
  },

  {
    path: 'customers/add',
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
    loadComponent: () =>
      import('./customers/add-customers/add-customers')
        .then(m => m.AddCustomerComponent),
  },
  {
    path: 'customers/manage',
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
    loadComponent: () =>
      import('./customers/manage-customers/manage-customers')
        .then(m => m.ManageCustomerComponent),
  },

  {
    path: 'calendar',
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'customer'] },
    loadComponent: () =>
      import('./calendar/calendar')
        .then(m => m.CalendarComponent),
  },

  {
    path: 'auth/signin',
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
    loadComponent: () =>
      import('./auth/signin/signin')
        .then(m => m.SignInComponent),
  },
  {
    path: 'auth/signup',
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
    loadComponent: () =>
      import('./auth/signup/signup')
        .then(m => m.SignUpComponent),
  },

  {
    path: 'ui/alerts',
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
    loadComponent: () =>
      import('./ui-elements/alerts/alerts')
        .then(m => m.AlertsComponent),
  },
  {
    path: 'ui/avatars',
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
    loadComponent: () =>
      import('./ui-elements/avatars/avatars')
        .then(m => m.AvatarsComponent),
  },
  {
    path: 'ui/badges',
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
    loadComponent: () =>
      import('./ui-elements/badge/badge')
        .then(m => m.BadgeComponent),
  },
  {
    path: 'ui/buttons',
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
    loadComponent: () =>
      import('./ui-elements/buttons/buttons')
        .then(m => m.ButtonsComponent),
  },
  {
    path: 'ui/images',
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
    loadComponent: () =>
      import('./ui-elements/images/images')
        .then(m => m.ImagesComponent),
  },
  {
    path: 'ui/videos',
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
    loadComponent: () =>
      import('./ui-elements/videos/videos')
        .then(m => m.VideosComponent),
  },

  {
    path: 'charts/line',
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
    loadComponent: () =>
      import('./charts/line-chart/line-chart')
        .then(m => m.LineChartComponent),
  },
  {
    path: 'charts/bar',
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
    loadComponent: () =>
      import('./charts/bar-chart/bar-chart')
        .then(m => m.BarChartComponent),
  },

  {
    path: 'forms/elements',
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
    loadComponent: () =>
      import('./forms/form-elements/form-elements')
        .then(m => m.FormElementsComponent),
  },

  {
    path: 'tables/basic',
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
    loadComponent: () =>
      import('./tables/basic-table/basic-table')
        .then(m => m.BasicTableComponent),
  },

  {
    path: 'profile',
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
    loadComponent: () =>
      import('./user-profile/user-profile')
        .then(m => m.UserProfileComponent),
  },
];
