import {Component} from '@angular/core';
import {AuthService} from './auth0.service';

@Component({
  selector: 'my-auth',
  template: `
    <div class="toolbar">
      <button (click)="login()">Login</button>
      <button (click)="logout()">Logout</button>
    </div>
  `,
  providers:[AuthService]
})
export class AuthComponent {
  constructor(private auth: AuthService) {}
  login() {
    this.auth.login();
  }
  logout() {
    this.auth.logout();
  }
}
