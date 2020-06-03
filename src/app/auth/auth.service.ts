import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';

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

    user: Subject<User>;

    constructor(private httpClient: HttpClient) {}

    signUp(email: string, password: string) {
        return this.httpClient.post<LoginSignUpResponsePayload>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBJRCutoN10m5ocS35VMGem-SJv6cW62r4',
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
        })
        );
    }

    login(email: string, password: string) {
        return this.httpClient.post<LoginSignUpResponsePayload>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBJRCutoN10m5ocS35VMGem-SJv6cW62r4',
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
        }))
    }

    private handleLoginSignup(email: string, token: string, id: string, tokenExpirationDate: string) {
        const expirationDate = new Date(new Date().getTime() + (Number(tokenExpirationDate) * 1000));
        const user = new User(
            email,
            id,
            token,
            expirationDate
        );
        this.user.next(user);
    }

    private handleSignupLoginError(httpErrorResponse: HttpErrorResponse) {
        let errorMessage = 'An unknown error ocurred';
        if(!httpErrorResponse.error || !httpErrorResponse.error.error) {
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