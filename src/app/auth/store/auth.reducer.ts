import { LOGIN } from './auth.actions';
import { User } from '../user.model';

const initialState = { user: null };

export interface State { user: User };

export function AuthReducer(state: State = initialState, action) {

    switch(action.type) {
        case LOGIN:
            return {
                ...initialState,
                user: action.payload
            }
        default:
            return state;
    }
}