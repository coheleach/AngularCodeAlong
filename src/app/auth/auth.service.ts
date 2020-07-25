import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Store } from '@ngrx/store';
import * as fromAppReducer from '../store/app.reducer';
import * as fromAuthActions from '../auth/store/auth.actions';

class LoginSignUpResponsePayload {
    idToken: string
    email: string
    refreshToken: string
    expiresIn: string
    localId: string
    registered?: boolean
}

@Injectable({providedIn: 'root'})
export class AuthService {

    user = new BehaviorSubject<User>(null);
    tokenExpirationTimer: any;

    constructor(
        private httpClient: HttpClient,
        private router: Router,
        private store: Store<fromAppReducer.AppState>
    ) {}

    signUp(email: string, password: string) {
        return this.httpClient.post<LoginSignUpResponsePayload>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        )
        .pipe(catchError((error: HttpErrorResponse) => {
            return this.handleSignupLoginError(error)
        }),
        tap((signupResponsePayload: LoginSignUpResponsePayload) => {
            this.handleLoginSignup(
                signupResponsePayload.email,
                signupResponsePayload.idToken,
                signupResponsePayload.localId,
                signupResponsePayload.expiresIn
            );
        }));
    }

    login(email: string, password: string) {
        return this.httpClient.post<LoginSignUpResponsePayload>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        )
        .pipe(catchError((error: HttpErrorResponse) => {
            return this.handleSignupLoginError(error)
        }),
        tap((signInResponsePayload: LoginSignUpResponsePayload) => {
            this.handleLoginSignup(
                signInResponsePayload.email,
                signInResponsePayload.idToken,
                signInResponsePayload.localId,
                signInResponsePayload.expiresIn
            );
        }));
    }

    logout() {
        this.store.dispatch(new fromAuthActions.Logout());
        //this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if(this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
    }

    autoLogin() {
        const userData: {
            email: string, 
            id: string, 
            _token: string, 
            _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userData'));
        if(!userData) {
            return;
        }
        const loadedUser = new User(
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate)
        );
        if(loadedUser.token) {
            this.store.dispatch(new fromAuthActions.Login({
                email: loadedUser.email,
                id: loadedUser.id,
                token: loadedUser.token,
                expirationDate: new Date(userData._tokenExpirationDate)
            }));
            //this.user.next(loadedUser);
            this.autoLogout(new Date(userData._tokenExpirationDate));
        }
    }

    autoLogout(expirationDuration: Date) {
        const milisecondsUntilExpiration = (expirationDuration.getTime() - new Date().getTime());
        console.log('seconds until auto-logout ' + milisecondsUntilExpiration / 1000);
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, milisecondsUntilExpiration);
    }

    private handleLoginSignup(email: string, token: string, id: string, tokenExpiresIn: string) {
        const expirationDate = new Date(new Date().getTime() + (Number(tokenExpiresIn) * 1000));
        const user = new User(
            email,
            id,
            token,
            expirationDate
        );
        this.store.dispatch(new fromAuthActions.Login({
            email: email,
            id: id,
            token: token,
            expirationDate: expirationDate
        }));
        //this.user.next(user);
        localStorage.setItem('userData', JSON.stringify(user));
        this.autoLogout(expirationDate);
    }

    private handleSignupLoginError(httpErrorResponse: HttpErrorResponse) {
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
        return throwError(errorMessage);
     }
}