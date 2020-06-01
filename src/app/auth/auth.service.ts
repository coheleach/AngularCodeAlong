import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

class SignupResponsePayload {
    idToken: string
    email: string
    refreshToken: string
    expiresIn: string
    localId: string
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
        );
    }
}