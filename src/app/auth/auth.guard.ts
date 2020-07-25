import { CanActivateChild, RouterStateSnapshot, ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { User } from './user.model';
import * as fromAppReducer from '../store/app.reducer';
import { Store } from '@ngrx/store';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivateChild, CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router,
        private store: Store<fromAppReducer.AppState>
    ) {}

    canActivate(
        childRoute: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot): 
        Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        return this.store.select('auth').pipe(
            take(1),
            map(auth => auth.user), 
            map((user: User) => {
            if(user) {
                return true;
            }

            return this.router.createUrlTree(['/auth']);
        }));
    }
    

    canActivateChild(
        route: ActivatedRouteSnapshot,
         state: RouterStateSnapshot): 
         Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

            return this.canActivate(route, state);
         }
}