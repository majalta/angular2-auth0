import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import {GeolocationService} from './geolocation.service';
import {GooglePlacesService} from './gplaces.service';

declare var google: any;

// TODO: refactorizar servicio maps.
@Component({
    selector: 'my-dashboard',
    template: `
        <div class="dashboard">
            <h3> Welcome {{profile.given_name}}!</h3>
            <p>Which places they are near me?</p>
            <button (click)="getPlaces()">Search</button>
            <ul>
                <li *ngFor="let restaurant of restaurants">
                <span class="badge">{{restaurant.name}}</span> {{restaurant.vicinity}}
                </li>
            </ul>
            <div id="results"></div>
        </div>
    `,
    providers:[
        GeolocationService,
        GooglePlacesService
    ]
})
// @CanActivate(() => this.tokenNotExpired())
export class DashboardComponent implements OnInit{
    profile: Object;
    restaurants: any[] = [];

    constructor (
        private geolocationService: GeolocationService,
        private googlePlacesService: GooglePlacesService
    ) {
        this.profile = JSON.parse(localStorage.getItem('profile'));
        console.log(this.profile)
    }

    ngOnInit() {
        //this.getPlaces();
    }

    getPlaces() {
        this.geolocationService.getLocation()
            .toPromise()
            .then(
                position => {
                    var latLng = new google.maps.LatLng(
                        position.coords.latitude,
                        position.coords.longitude);
                    var container = document.getElementById('results');
                    this.googlePlacesService.getPlaces(container, latLng)
                        .toPromise()
                        .then((list:any[]) => {
                            console.log(list);
                            this.restaurants = list;
                        });
                }
            );
    }
}
