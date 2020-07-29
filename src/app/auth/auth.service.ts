import { Injectable } from '@angular/core';
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

    tokenExpirationTimer: any;

    constructor(private store: Store<fromAppReducer.AppState>) {}

    setLogoutTimer(expirationDuration: Date) {
        const milisecondsUntilExpiration = (expirationDuration.getTime() - new Date().getTime());
        console.log('seconds until auto-logout ' + milisecondsUntilExpiration / 1000);
        this.tokenExpirationTimer = setTimeout(() => {
            //this.logout();
            this.store.dispatch(new fromAuthActions.Logout());
        }, milisecondsUntilExpiration);
    }

    clearLogoutTimer() {
        if(this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
            this.tokenExpirationTimer = null;
        }
    }
}