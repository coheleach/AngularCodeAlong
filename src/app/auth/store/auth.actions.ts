import { Action } from '@ngrx/store'
import { User } from '../user.model';

export const LOGIN = 'LOGIN'

export class AuthLogin implements Action {
    type: string = LOGIN;
    
    constructor(public payload: User) {}
}