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
        case fromRecipeActions.ADD_RECIPE:
            return {
                ...state,
                recipes: [...state.recipes, action.payload]
            };
        case fromRecipeActions.UPDATE_RECIPE:
            const updatedRecipe = { 
                ...state.recipes[action.payload.index],
                ...action.payload.recipe
            };
            const updatedRecipeList = [...state.recipes];
            updatedRecipeList[action.payload.index] = updatedRecipe;
            return {
                ...state,
                recipes: updatedRecipeList
            };
        case fromRecipeActions.DELETE_RECIPE:
            return {
                ...state,
                recipes: state.recipes.filter((recipe, index) => {
                    return index !== action.payload
                })
            }
        default:
            return state;
    }
}