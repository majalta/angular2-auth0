import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import {GeolocationService} from './geolocation.service';
import {GooglePlacesService} from './gplaces.service';
import {ImageRecognitionService} from './imagerecognition.service';

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
                <div *ngFor="let photo of restaurant.photos">
                    <img [src]="photo">
                </div>
                </li>
            </ul>
            <div id="results"></div>
        </div>
    `,
    providers:[
        GeolocationService,
        GooglePlacesService,
        ImageRecognitionService
    ]
})
// @CanActivate(() => this.tokenNotExpired())
export class DashboardComponent implements OnInit{
    profile: Object;
    restaurants: any[] = [];

    constructor (
        private geolocationService: GeolocationService,
        private googlePlacesService: GooglePlacesService,
        private imagerecognitionservice: ImageRecognitionService
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
                            list.forEach(
                                (element, index, array) => {
                                    //google over request error
                                    setTimeout(function () {
                                    this.getPhotosUrl(element.place_id)
                                        .then(urlList => {
                                            array[index].photos = urlList;
                                        })
                                    }.bind(this), index*300);
                                }
                            )
                            this.restaurants = list;
                        });
                }
            );
    }

    getPhotosUrl(placeId) {
        var urlList: string[] = [];
        return this.googlePlacesService.getDetails(placeId)
            .toPromise()
            .then(data => {
                //loop photos array to get the url.
                if (data.photos) {
                    data.photos.map(
                        photo => {
                            var url = photo.getUrl(
                                {'maxWidth': 300, 'maxHeight': 300}
                            );
                            var photoFood = this.getPhotosTaggedWith(url,'comida');
                            photoFood.subscribe(x => {
                                if(x) {
                                    urlList.push(url);
                                }
                            });
                        }
                    );
                } else {
                    console.log("NO photos for this place_id: " + placeId);
                }
                return urlList;
            })
            .catch(error => {
                console.error(error);
                return urlList;
            });
    }

    getPhotosTaggedWith(photoUrl, tagName) {
        var obs = Observable.create(
            observer => {
                this.imagerecognitionservice.getTags(photoUrl)
                    .subscribe(tags => {
                        observer.next(tags);
                    })
            }
        ).switchMap((tags: any[]) => Observable.create(
                observer => {
                    tags.map(tag => {
                        if (tag.class == tagName) {
                            console.log(tag)
                            console.log(photoUrl)
                            observer.next(true);
                        } else {
                            observer.next(false);
                        }
                    })
                    observer.complete();
                }
            ));
        return obs;
    }
}
