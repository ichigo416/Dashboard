import { Routes } from '@angular/router';

export const routes: Routes = [

  {
  path: '',
  redirectTo: 'dashboard/ecommerce',
  pathMatch: 'full',
},

{
  path: 'dashboard',
  children: [
    {
      path: '',
      redirectTo: 'ecommerce',
      pathMatch: 'full',
    },
    {
      path: 'ecommerce',
      loadComponent: () =>
        import('./pages/dashboard/dashboard')
          .then(m => m.DashboardComponent),
    },
  ],
},

  {
    path: 'customers',
    children: [
      {
        path: 'add',
        loadComponent: () =>
          import('./customers/add-customers/add-customers')
            .then(m => m.AddCustomerComponent),
      },
      {
        path: 'manage',
        loadComponent: () =>
          import('./customers/manage-customers/manage-customers')
            .then(m => m.ManageCustomerComponent),
      },
    ],
  },

  {
  path: 'calendar',
  loadComponent: () =>
    import('./calendar/calendar')
      .then(m => m.CalendarComponent),
},

  // Authentication
  
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

  // =========================
  // UI Elements
  // =========================
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

  // Charts
  
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

  // Forms
 
  {
    path: 'forms/elements',
    loadComponent: () =>
      import('./forms/form-elements/form-elements')
        .then(m => m.FormElementsComponent),
  },

  // Tables
  
  {
    path: 'tables/basic',
    loadComponent: () =>
      import('./tables/basic-table/basic-table')
        .then(m => m.BasicTableComponent),
  },
{
  path: 'profile',
  loadComponent: () =>
    import('./user-profile/user-profile')
      .then(m => m.UserProfileComponent),
},

];
