import { bootstrap }    from '@angular/platform-browser-dynamic';
import { AppComponent } from './app/app.component';
import {
  ROUTER_PROVIDERS,
} from '@angular/router-deprecated';

bootstrap(AppComponent, [
    ROUTER_PROVIDERS
])
.catch(err => console.error(err));
