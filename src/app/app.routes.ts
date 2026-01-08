import { Routes } from '@angular/router';

export const routes: Routes = [

  // Redirect root → dashboard
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

  // Dashboard
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard')
        .then(m => m.DashboardComponent),
  }, 
  {
  path: 'dashboard',
  redirectTo: '',
  pathMatch: 'full',
},


  // Auth
  {
    path: 'auth/signin',
    loadComponent: () =>
      import('./auth/signin/signin')
        .then(m => m.SignInComponent),
  },
  {
    path: 'auth/signup',
    loadComponent: () =>
      import('./auth/signup/signup')
        .then(m => m.SignUpComponent),
  },

  // UI Elements
  {
    path: 'ui/alerts',
    loadComponent: () =>
      import('./ui-elements/alerts/alerts')
        .then(m => m.AlertsComponent),
  },
  {
    path: 'ui/avatars',
    loadComponent: () =>
      import('./ui-elements/avatars/avatars')
        .then(m => m.AvatarsComponent),
  },
  {
    path: 'ui/badges',
    loadComponent: () =>
      import('./ui-elements/badge/badge')
        .then(m => m.BadgeComponent),
  },
  {
    path: 'ui/buttons',
    loadComponent: () =>
      import('./ui-elements/buttons/buttons')
        .then(m => m.ButtonsComponent),
  },
  {
    path: 'ui/images',
    loadComponent: () =>
      import('./ui-elements/images/images')
        .then(m => m.ImagesComponent),
  },
  {
    path: 'ui/videos',
    loadComponent: () =>
      import('./ui-elements/videos/videos')
        .then(m => m.VideosComponent),
  },

  {
  path: 'charts/line',
  loadComponent: () =>
    import('./charts/line-chart/line-chart')
      .then(m => m.LineChartComponent),
},
{
  path: 'charts/bar',
  loadComponent: () =>
    import('./charts/bar-chart/bar-chart')
      .then(m => m.BarChartComponent),
},

];
