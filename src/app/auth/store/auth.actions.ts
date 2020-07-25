import { Action } from '@ngrx/store';
import { User } from '../user.model';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export class Login implements Action {
    type: string = LOGIN;
    
    constructor(
        public payload: 
        { 
            email: string
            id: string,
            token: string,
            expirationDate: Date
        }
    ) {}
}

export class Logout implements Action {
    type: string = LOGOUT;
}