import {Component, OnInit} from '@angular/core';
// import {JwtHelper} from 'angular2-jwt';

@Component({
  selector: 'my-dashboard',
  template: `
    <div class="dashboard"> dd
        <h3> Welcome! {{profile.given_name}}</h3>
    </div>
  `
})
// @CanActivate(() => this.tokenNotExpired())

export class DashboardComponent {
    profile: Object;

    constructor () {
        this.profile = localStorage.getItem('profile');
        console.log("patata")
    }
}
