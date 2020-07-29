import { Actions, ofType, Effect } from '@ngrx/effects';
import * as fromAuthActions from './auth.actions';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.model';
import * as fromAppReducer from '../store/auth.reducer';
import { Store } from '@ngrx/store';
import { AuthService } from '../auth.service';

class LoginSignUpResponsePayload {
    idToken: string
    email: string
    refreshToken: string
    expiresIn: string
    localId: string
    registered?: boolean
}

const handleAuhentication = (email: string, token: string, id: string, tokenExpiresIn: string) => {
    const expirationDate = new Date(new Date().getTime() + (Number(tokenExpiresIn) * 1000));
    const userData = new User(
        email,
        token,
        id,
        expirationDate
    );
    localStorage.setItem('userData', JSON.stringify(userData));
    return new fromAuthActions.AuthenticateSuccess({
        email: email,
        id: id,
        token: token,
        expirationDate: expirationDate
    });
};

const handleError = (httpErrorResponse: HttpErrorResponse) => {
    let errorMessage = 'An unknown error ocurred';
    if(!httpErrorResponse.error || !httpErrorResponse.error.error) {
        console.log('handleSignupLoginError: ' + httpErrorResponse)
        return throwError(errorMessage);
    }
    switch(httpErrorResponse.error.error.message) {
        case 'EMAIL_EXISTS':
            errorMessage = 'The email address is already in use by another account.';
            break;
        case 'EMAIL_NOT_FOUND':
            errorMessage = 'No account was found with this email';
            break;
        case 'INVALID_PASSWORD':
            errorMessage = 'Incorrect Password'
    }
    return of(new fromAuthActions.AuthenticateFail(errorMessage));
};

//
//          REVIEW
//
//      To internalize all Auth code to
//      NgRx, we merge the action & reducer
//      with an effect class.  Take the AuthService,
//      for example.  We are conceptionally
//      dividing it into the following:
//      
//      A) Login http request (indirectly state changing - called a side effect)
//      B) capture/Process the server response (directly state changing)
//
//      We do this by adding another Action dispatch
//      listener here, called AuthEffect.  It too listens
//      for dispatched actions, because though an action
//      may only be handled by some reducers, it is
//      still 'heard' by all reducers.  Hence, we
//      have made a new action called LoginStart and
//      handle it here.
//
//      NOTE: we handle indirect state changing actions
//      in the Effect class
//
@Injectable()
export class AuthEffect {
    
    @Effect()
    authSignUp = this.actions$.pipe(
        ofType(fromAuthActions.SIGNUP_START),
        switchMap((signupStart: fromAuthActions.SignupStart) => {
            return this.httpClient.post<LoginSignUpResponsePayload>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
                {
                    email: signupStart.payload.email,
                    password: signupStart.payload.password,
                    returnSecureToken: true
                }
            ).pipe(
                tap((response: LoginSignUpResponsePayload) => {
                    const expirationDate = new Date(new Date().getTime() + (Number(response.expiresIn) * 1000));
                    this.authService.setLogoutTimer(expirationDate);
                }),
                map((response: LoginSignUpResponsePayload) => {
                    return handleAuhentication(response.email, response.idToken, response.localId, response.expiresIn);
                }),
                catchError((error: HttpErrorResponse) => {
                    return handleError(error);
                })
            );
        })
    );

    @Effect()
    authLogin = this.actions$.pipe(
        ofType(fromAuthActions.LOGIN_START),
        //return higher order inner observable
        switchMap((authData: fromAuthActions.LoginStart) => {
            return this.httpClient.post<LoginSignUpResponsePayload>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
                {
                    email: authData.payload.email,
                    password: authData.payload.password,
                    returnSecureToken: true
                }
            ).pipe(
                tap((response: LoginSignUpResponsePayload) => {
                    const expirationDate = new Date(new Date().getTime() + (Number(response.expiresIn) * 1000));
                    this.authService.setLogoutTimer(expirationDate);
                }),
                map((response: LoginSignUpResponsePayload) => {
                    return handleAuhentication(response.email, response.idToken, response.localId, response.expiresIn);
                }),
                catchError((error: HttpErrorResponse) => {
                    return handleError(error);
                })
            )
        })
    )

    @Effect({dispatch: false})
    authRedirect = this.actions$.pipe(
        ofType(fromAuthActions.AUTHENTICATE_SUCCESS),
        tap(() => {
            this.router.navigate(['/']);
        })
    );

    @Effect({dispatch: false})
    authLogout = this.actions$.pipe(
        ofType(fromAuthActions.LOGOUT),
        tap(() => {
            this.authService.clearLogoutTimer();
            localStorage.clear();
            this.router.navigate(['/auth']);
            return of();
        })
    );

    @Effect()
    authAutoLogin = this.actions$.pipe(
        ofType(fromAuthActions.AUTO_LOGIN),
        map(() => {
            const userData: {
                email: string, 
                id: string, 
                _token: string, 
                _tokenExpirationDate: string
            } = JSON.parse(localStorage.getItem('userData'));
            if(!userData) {
                return {type: 'DUMMY'};
            }
            const loadedUser = new User(
                userData.email,
                userData.id,
                userData._token,
                new Date(userData._tokenExpirationDate)
            );
            if(loadedUser.token) {
                this.authService.setLogoutTimer(new Date(userData._tokenExpirationDate));
                return new fromAuthActions.AuthenticateSuccess({
                    email: loadedUser.email,
                    id: loadedUser.id,
                    token: loadedUser.token,
                    expirationDate: new Date(userData._tokenExpirationDate)
                });
                //this.user.next(loadedUser);
                //this.autoLogout(new Date(userData._tokenExpirationDate));
            }
            return {type: 'DUMMY'};
        })
    )

    constructor(
        private actions$: Actions,      // ACTIONS is a stream of dispatched actions.  It cannot complete/die, so preserve it.
        private httpClient: HttpClient,
        private router: Router,
        private authService: AuthService
    ) {}
}
