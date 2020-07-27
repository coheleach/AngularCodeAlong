import { Action } from '@ngrx/store';
import { User } from '../user.model';

export const LOGIN_START = '[Auth] LOGIN_START';
export const LOGIN = '[Auth] LOGIN';
export const LOGOUT = '[Auth] LOGOUT';

export class Login implements Action {
    readonly type: string = LOGIN;
    
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
    readonly type: string = LOGOUT;
}

export class LoginStart implements Action {
    readonly type: string = LOGIN_START;

    constructor(
        public payload: 
        {
            email: string,
            password: string
        }
    ) {}
}
