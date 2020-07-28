import { Action, ActionReducer } from '@ngrx/store';
import { User } from '../user.model';


export const SIGNUP_START = '[Auth] SIGNUP_START'
export const LOGIN_START = '[Auth] LOGIN_START';
export const AUTHENTICATE_SUCCESS = '[Auth] AUTHENTICATE SUCCESS';
export const AUTHENTICATE_FAIL = '[Auth] AUTHENTICATE FAIL';
export const LOGOUT = '[Auth] LOGOUT';
export const CLEAR_ERROR = '[Auth] CLEAR ERROR';
export const AUTO_LOGIN = '[Auth] AUTO LOGIN';

export class AuthenticateSuccess implements Action {
    readonly type: string = AUTHENTICATE_SUCCESS;
    
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

export class AuthenticateFail implements Action {
    readonly type: string = AUTHENTICATE_FAIL;

    constructor(public payload: string) {}
}

export class SignupStart implements Action {
    readonly type: string = SIGNUP_START;

    constructor(
        public payload: 
        {
            email: string, 
            password: string
        }
    ) {}
}

export class ClearError implements Action {
    readonly type: string = CLEAR_ERROR;
}

export class AutoLogin implements Action {
    readonly type: string = AUTO_LOGIN;
}
