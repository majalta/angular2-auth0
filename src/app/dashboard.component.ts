import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
// import {JwtHelper} from 'angular2-jwt';

declare var google: any;

// TODO: refactorizar servicio maps.

@Component({
  selector: 'my-dashboard',
  template: `
    <div class="dashboard"> dd
        <h3> Welcome {{profile.given_name}}!</h3>
        <button (click)="getPlaces()">Get Location</button>
        <ul>
            <li
                *ngFor="let restaurant of restaurants"
            >
                <span class="badge">{{restaurant.id}}</span> {{restaurant.name}}
            </li>
        </ul>
        <div id="map"></div>
    </div>
  `
})
// @CanActivate(() => this.tokenNotExpired())
export class DashboardComponent {
    profile: Object;
    restaurants: any[];

    constructor () {
        this.profile = JSON.parse(localStorage.getItem('profile'));
        this.restaurants = [];
        console.log(this.profile)
    }
    getLocation () {
        // Try HTML5 geolocation.
        let options = {timeout: 10000, enableHighAccuracy: true};
        var data = new Observable(
            observer => {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                        observer.next(latLng);
                        observer.complete();
                    },
                    (error) => {
                        console.log(error);
                    }, options
                );
            }
        );
        return data.toPromise();
    }

    getPlaces() {
        var result = this.getLocation()
            .then(
                position => {
                    var map = new google.maps.Map(
                        document.getElementById('map'),
                        {
                            center: position,
                            zoom: 15
                        }
                    );
                    var service = new google.maps.places.PlacesService(map);
                    service.nearbySearch({
                        location: position,
                        radius: 500,
                        types: ['restaurant']
                    }, this.logResults);
                }
            );
    }

    logResults(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                console.log(results[i]);
            }
            this.restaurants = results;
            console.log(this.restaurants)
        }
    }
}
