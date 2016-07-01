import {Injectable, provide} from '@angular/core';
import {Http, URLSearchParams, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class ImageRecognitionService {

    private watsonUrl = 'https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classify';

    constructor(private http: Http) { }

    getTags(imageUrl) {
        let params = new URLSearchParams();
        params.set('api_key', 'XXXXX');
        params.set('url', imageUrl);
        params.set('classifier_ids', 'default');
        params.set('owners', 'IBM');
        params.set('threshold', '0.8');
        params.set('version', '2016-05-20');
        return this.http.get(this.watsonUrl, {search: params})
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        let data = res.json();
        if (data.images_processed === 1) {
            return data.images[0].classifiers[0].classes;
        }
    }
    private handleError (error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}
