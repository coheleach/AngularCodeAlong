import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { pipe, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

class SignupResponsePayload {
    idToken: string
    email: string
    refreshToken: string
    expiresIn: string
    localId: string
}

class SignInResponsePayload  {
    idToken: string
    email: string
    refreshToken: string
    expiresIn: string
    localId: string
    registered: boolean
}

@Injectable({providedIn: 'root'})
export class AuthService {

    constructor(private httpClient: HttpClient) {}

    signUp(email: string, password: string) {
        return this.httpClient.post<SignupResponsePayload>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBJRCutoN10m5ocS35VMGem-SJv6cW62r4',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        )
        .pipe(catchError(error => {
            let errorMessage = 'An unknown error ocurred';
            if(!error.error || !error.error.error) {
                return throwError(errorMessage);
            }
            switch(error.error.error.message) {
                case 'EMAIL_EXISTS':
                    errorMessage = 'The email address is already in use by another account.';
                    break;
            }
            return throwError(errorMessage);
        }))
    }

    login(email: string, password: string) {
        return this.httpClient.post<SignInResponsePayload>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBJRCutoN10m5ocS35VMGem-SJv6cW62r4',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        )
        .pipe(catchError(error => {
            let errorMessage = 'An unknown error ocurred';
            if(!error.error || !error.error.error) {
                return throwError(errorMessage);
            }
            switch(error.error.error.message) {
                case 'EMAIL_NOT_FOUND':
                    errorMessage = 'No account was found with this email';
                    break;
                case 'INVALID_PASSWORD':
                    errorMessage = 'Incorrect Password';
            }
            return throwError(errorMessage);
        }))
    }
}