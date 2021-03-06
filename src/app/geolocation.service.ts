import {Injectable, provide} from '@angular/core';
import {Observable} from 'rxjs/Rx';

const GEOLOCATION_ERRORS = {
	'errors.location.unsupportedBrowser': 'Browser does not support location services',
	'errors.location.permissionDenied': 'You have rejected access to your location',
	'errors.location.positionUnavailable': 'Unable to determine your location',
	'errors.location.timeout': 'Service timeout has been reached'
};

@Injectable()
export class GeolocationService {

    getLocation (options = {timeout: 10000, enableHighAccuracy: true}): Observable<any> {
        // Try HTML5 geolocation.
        return new Observable(
            observer => {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        observer.next(position);
                        observer.complete();
                    },
                    (error) => {
						switch (error.code) {
							case 1:
								observer.error(GEOLOCATION_ERRORS['errors.location.permissionDenied']);
								break;
							case 2:
								observer.error(GEOLOCATION_ERRORS['errors.location.positionUnavailable']);
								break;
							case 3:
								observer.error(GEOLOCATION_ERRORS['errors.location.timeout']);
								break;
						}
					}, options
                );
            }
        );
    }
}
