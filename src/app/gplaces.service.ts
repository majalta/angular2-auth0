import {Injectable, provide} from '@angular/core';
import {Observable} from 'rxjs/Rx';

declare var google: any;

@Injectable()
export class GooglePlacesService {

    gService: any;

    constructor () {
        this.gService = new google.maps.places.PlacesService(
            document.createElement('div')
        );
    }

    getPlaces (
        htmlContainer,
        position: google.maps.LatLng,
        radius = 500,
        type ='restaurant'
    ): Observable<any> {
        return new Observable(
            observer => {
                this.gService.nearbySearch(
                    {
                        location: position,
                        radius: radius,
                        types: [type]
                    },
                    (results, status) => {
                        if (status === google.maps.places.PlacesServiceStatus.OK) {
                            observer.next(results);
                        }
                        else {
                            observer.error(status);
                        }
                        observer.complete();
                    }
                )
            }
        );
    }

    getDetails(placeId:string): Observable<any> {
        return new Observable(
            observer => {
                this.gService.getDetails(
                    {
                        placeId: placeId
                    },
                    (data, status) => {
                        if (status === google.maps.places.PlacesServiceStatus.OK) {
                            observer.next(data);
                        }
                        else {
                            observer.error(status);
                        }
                        observer.complete();
                    }
                )
            }
        );
    }
}
