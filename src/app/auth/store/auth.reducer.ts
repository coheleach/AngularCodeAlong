import { LOGIN, LOGOUT, LOGIN_START, LOGIN_FAIL } from './auth.actions';
import { User } from '../user.model';

const initialState = {
    user: null, 
    authError: null,
    loading: false
};

export interface State { 
    user: User
    authError: string
    loading: boolean
};

export function AuthReducer(state: State = initialState, action) {

    switch(action.type) {
        case LOGIN:
            return {
                ...state,
                user: new User(
                    action.payload.email,
                    action.payload.id,
                    action.payload.token,
                    action.payload.expirationDate
                ),
                loading: false
            };
        case LOGIN_START:
            return {
                ...state,
                authError: null,
                loading: true
            };
        case LOGIN_FAIL:
            return {
                ...state,
                user: null,
                loading: false,
                authError: action.payload
            }
        case LOGOUT:
            return {
                ...state,
                user: null,
                authError: null
            };
        default:
            return state;
    }
}