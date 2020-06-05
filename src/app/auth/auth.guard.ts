import { CanActivateChild, RouterStateSnapshot, ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { User } from './user.model';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivateChild, CanActivate {

    constructor(private authService: AuthService,
                private router: Router) {}

    canActivate(
        childRoute: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot): 
        Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        return this.authService.user.pipe(take(1), map((user: User) => {
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