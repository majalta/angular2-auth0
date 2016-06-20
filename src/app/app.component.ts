import {Component} from '@angular/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router-deprecated';

import {AuthComponent} from './auth.component';
import {DashboardComponent} from './dashboard.component';

@Component({
  selector: 'my-app',
  styles: [`
    .app {

    }
  `],
  template: `
    <h1>{{title}}</h1>
    <router-outlet></router-outlet>
  `,
    directives: [
        AuthComponent,
        ROUTER_DIRECTIVES
    ],
    providers: [
        ROUTER_PROVIDERS,
    ]
})

@RouteConfig([
    {
        path: '/login',
        name: 'Login',
        component: AuthComponent,
        useAsDefault: true
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: DashboardComponent,
    }
])

export class AppComponent {
    title = 'Sample App!';
}
