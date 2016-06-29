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
            <li *ngFor="let restaurant of restaurants">
                <span class="badge">{{restaurant.name}}</span> {{restaurant.vicinity}}
            </li>
        </ul>
        <div id="map"></div>
    </div>
  `
})
// @CanActivate(() => this.tokenNotExpired())
export class DashboardComponent implements OnInit{
    profile: Object;
    restaurants: any[] = [];

    constructor () {
        this.profile = JSON.parse(localStorage.getItem('profile'));
        console.log(this.profile)
    }
    ngOnInit() {
        this.getPlaces();
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
        this.getLocation()
            .then(
                position => {
                    console.log("eee")
                    var map = new google.maps.Map(
                        document.getElementById('map'),
                        {
                            center: position,
                            zoom: 15
                        }
                    );
                    this.getRestaurants(map, position)
                        .then((list:any[]) => {
                            console.log(list);
                            this.restaurants = list;
                        });
                }
            );
    }

    getRestaurants(map, position) {
        var data = new Observable(
            observer => {
                var service = new google.maps.places.PlacesService(map);
                service.nearbySearch({location: position,
                    radius: 500,
                    types: ['restaurant']},
                    (results, status) => {
                        if (status === google.maps.places.PlacesServiceStatus.OK) {
                            observer.next(results);
                            observer.complete();
                        }
                    }
                )
            }
        );
        return data.toPromise();
    }
}
