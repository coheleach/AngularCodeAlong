import { AUTHENTICATE_SUCCESS, LOGOUT, LOGIN_START, AUTHENTICATE_FAIL, SIGNUP_START, CLEAR_ERROR } from './auth.actions';
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
        case AUTHENTICATE_SUCCESS:
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
        case SIGNUP_START:
            return {
                ...state,
                loading: true,
                authError: null,
            }
        case LOGIN_START:
            return {
                ...state,
                authError: null,
                loading: true
            };
        case AUTHENTICATE_FAIL:
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
        case CLEAR_ERROR:
            return {
                ...state,
                authError: null
            }
        default:
            return state;
    }
}