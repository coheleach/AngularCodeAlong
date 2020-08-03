import { Recipe } from '../recipe.model';
import * as fromRecipeActions from './recipes.actions';

export interface State {
    recipes: Recipe[]
}

const initialState = {
    recipes: []
}

export function recipesReducer(state: State = initialState, action): State {

    switch(action.type) {
        case fromRecipeActions.SET_RECIPES:
            return {
                ...state,
                recipes: [...action.payload]
            };
        default:
            return state;
    }
}