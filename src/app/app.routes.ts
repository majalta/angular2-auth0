import { provideRouter, RouterConfig }  from '@angular/router';

import {AuthComponent} from './auth.component';
import {DashboardComponent} from './dashboard.component';

export const routes: RouterConfig = [
    {
        path: '/login',
        component: AuthComponent,

    },
    {
        path: '/dashboard',
        component: DashboardComponent,
    }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
