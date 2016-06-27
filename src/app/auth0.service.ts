import {Injectable} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Config} from '../../config/auth0.config';
import {tokenNotExpired} from 'angular2-jwt';

// We want to avoid any 'name not found' warnings from TypeScript
declare var Auth0Lock: any;

@Injectable()
export class AuthService {
    config = new Config();
    lock;
    constructor(
        private router: Router
    ) {
        this.lock = new Auth0Lock(
            this.config.getKey(),
            this.config.getDomain()
        );
    }

    login() {
        this.lock.show((error: string, profile: Object, id_token: string) => {
            if (error) {
                console.log(error);
            }
            // We get a profile object for the user from Auth0
            localStorage.setItem('profile', JSON.stringify(profile));
            // We also get the user's JWT
            localStorage.setItem('id_token', id_token);
            this.router.navigate(['/dashboard']);
        });
    }

    authenticated() {
        // Check if there's an unexpired JWT
        // It searches for an item in localStorage with key == 'id_token'
        return tokenNotExpired();
    }

    logout() {
        // To log out, we just need to remove
        // the user's profile and token
        localStorage.removeItem('profile');
        localStorage.removeItem('id_token');
    }
}
