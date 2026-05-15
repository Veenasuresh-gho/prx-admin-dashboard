import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./features/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },

  {
    path: 'login/:id',
    component: LoginComponent,
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },

  {
    path: 'comps',
    loadComponent: () =>
      import('./components/ghocomponents').then(
        (m) => m.GHOComponents
      ),
  },

  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dash/dash').then((m) => m.Dashboard),
  },

  {
    path: 'dashboard/cases',
    loadComponent: () =>
      import('./cases/cases').then((m) => m.AdminCases),
  },

  {
    path: 'contact',
    loadComponent: () =>
      import('./contact/contact').then((m) => m.Contact),
  },

  {
    path: 'settings',
    loadComponent: () =>
      import('./settings/settings').then((m) => m.Settings),
  },

  {
    path: 'dashboard/accounts',
    loadComponent: () =>
      import('./accounts/accounts').then(
        (m) => m.AdminAccounts
      ),
  },

  {
    path: 'dashboard/profile',
    loadComponent: () =>
      import('./profile/profile').then((m) => m.Profile),
  },

  {
    path: 'lists',
    loadComponent: () =>
      import('./lists/doctor').then((m) => m.HospitalList),
  },

  {
    path: 'loginList',
    loadComponent: () =>
      import('./login-list/login-list').then(
        (m) => m.LoginList
      ),
  },

  {
    path: 'NewUserList',
    loadComponent: () =>
      import('./new-user-list/new-user-list').then(
        (m) => m.NewUserList
      ),
  },

  {
    path: 'advertisement',
    loadComponent: () =>
      import('./advertisements/advertisements').then(
        (m) => m.Advertisements
      ),
  },

  {
    path: 'dashboard/payments',
    loadComponent: () =>
      import('./payments/payment').then(
        (m) => m.AdminPayments
      ),
  },

  {
    path: 'specialties',
    loadComponent: () =>
      import('./specialty/specialty').then(
        (m) => m.Specialty
      ),
  },

  {
    path: 'country',
    loadComponent: () =>
      import('./country/country').then(
        (m) => m.AdminCountry
      ),
  },

  {
    path: 'dashboard/help-center',
    loadComponent: () =>
      import('./features/help-manager').then(
        (m) => m.GHOHelpMgr
      ),
  },

  {
    path: 'about',
    loadComponent: () =>
      import('./settings/components/about/about').then(
        (m) => m.About
      ),
  },

  {
    path: 'privacy-policy',
    loadComponent: () =>
      import(
        './settings/components/privacy-and-policy/privacy-and-policy'
      ).then((m) => m.PrivacyAndPolicy),
  },

  {
    path: '**',
    redirectTo: '',
  },
];