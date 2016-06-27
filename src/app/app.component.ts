import {Component} from '@angular/core';
import { ROUTER_DIRECTIVES }    from '@angular/router';
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
    ]
})

export class AppComponent {
    title = 'Sample App!';
}
