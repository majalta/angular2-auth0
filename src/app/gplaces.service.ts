import {Injectable, provide} from '@angular/core';
import {Observable} from 'rxjs/Rx';

declare var google: any;

@Injectable()
export class GooglePlacesService {

    getPlaces (
        htmlContainer,
        position: google.maps.LatLng,
        radius = 500,
        type ='restaurant'
    ) {
        return new Observable(
            observer => {
                var service = new google.maps.places.PlacesService(htmlContainer);
                service.nearbySearch(
                    {
                        location: position,
                        radius: radius,
                        types: [type]
                    },
                    (results, status) => {
                        if (status === google.maps.places.PlacesServiceStatus.OK) {
                            observer.next(results);
                            observer.complete();
                        }
                    }
                )
            }
        );
    }
}
