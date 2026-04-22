import { Routes } from '@angular/router';

import { LoginComponent } from './features/login/login.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => { return import('./features/login/login.component').then((m) => m.LoginComponent) },
    },

    { path: 'login/:id', component: LoginComponent },


    {
        path: 'login',
        pathMatch: 'full',
        loadComponent: () => { return import('./features/login/login.component').then((m) => m.LoginComponent) },
    },


    {
        path: 'comps',
        pathMatch: 'full',
        loadComponent: () => { return import('./components/ghocomponents').then((m) => m.GHOComponents) },
    },

    {
        path: 'dashboard',
        pathMatch: 'full',
        loadComponent: () => { return import('./dash/dash').then((m) => m.Dashboard) },
    },

    {
        path: 'dashboard/cases',
        pathMatch: 'full',
        loadComponent: () => { return import('./cases/cases').then((m) => m.AdminCases) },
    },

    {
        path: 'contact',
        loadComponent: () => { return import('./contact/contact').then((m) => m.Contact) },
    },
    {
        path: 'settings',
        loadComponent: () => { return import('./settings/settings').then(m => m.Settings) }
    },

    {
        path: 'dashboard/accounts',
        loadComponent: () => { return import('./accounts/accounts').then((m) => m.AdminAccounts) },
    },
    {
        path: 'dashboard/profile',
        loadComponent: () => { return import('./profile/profile').then((m) => m.Profile) },
    },
    {
        path: 'lists',
        loadComponent: () => { return import('./lists/doctor').then((m) => m.HospitalList) },
    },
    {
        path: 'advertisement',
        loadComponent: () => { return import('./advertisements/advertisements').then((m) => m.Advertisements) },
    },
    {
        path: 'dashboard/payments',
        loadComponent: () => { return import('./payments/payment').then((m) => m.AdminPayments) },
    },

    {
        path: 'specialty',
        loadComponent: () => { return import('./specialty/specialty').then((m) => m.AdminSpecialty) },
    },

    {
        path: 'country',
        loadComponent: () => { return import('./country/country').then((m) => m.AdminCountry) },
    },

    {
        path: 'dashboard/help-center',
        loadComponent: () => { return import('./features/help-manager').then((m) => m.GHOHelpMgr) },
    },


    {
        path: 'settings',
        loadComponent: () =>
            import('./settings/settings').then(m => m.Settings),
    },
    {
        path: 'about',
        loadComponent: () =>
            import('./settings/components/about/about').then(m => m.About)
    },
    {
        path: 'privacy-policy',
        loadComponent: () =>
            import('./settings/components/privacy-and-policy/privacy-and-policy')
                .then(m => m.PrivacyAndPolicy)
    }
]





