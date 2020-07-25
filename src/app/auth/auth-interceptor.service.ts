import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from './user.model';
import { exhaustMap, take, map } from 'rxjs/operators';
import * as fromAppReducer from '../store/app.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

    constructor(private authService: AuthService, private store: Store<fromAppReducer.AppState>) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.store.select('auth').pipe(take(1),
        map(auth => auth.user),
        exhaustMap((user: User) => {
            if(!user) {
                return next.handle(req);
            }
            const modifiedRequest = req.clone({params: new HttpParams().set('auth',user.token)});
            return next.handle(modifiedRequest);
        }));
    }
}