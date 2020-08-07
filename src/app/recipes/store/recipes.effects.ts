import { Actions, Effect, ofType } from '@ngrx/effects';
import * as fromRecipeActions from './recipes.actions';
import * as fromAppReducer from '../../store/app.reducer';
import * as fromRecipesReducer from './recipes.reducer';
import { tap, switchMap, map, withLatestFrom } from 'rxjs/operators';
import { Recipe } from '../recipe.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

@Injectable()
export class RecipesEffects {

    @Effect()
    fetchRecipes = this.actions$.pipe(
        ofType(fromRecipeActions.FETCH_RECIPES),
        switchMap(() => {
            return this.httpClient.get<Recipe[]>('https://ng-course-recipe-book-ed9b7.firebaseio.com/recipes.json')
        }),
        map(serverResponseBody => {
            return serverResponseBody.map(recipeElement => {
            return {...recipeElement, 
                ingredients: recipeElement['ingredients'] ? recipeElement['ingredients'] : []};
            })
        }),
        map((recipes: Recipe[]) => {
            return new fromRecipeActions.SetRecipes(recipes);
        })
    );

    @Effect({dispatch: false})
    storeRecipes = this.actions$.pipe(
        (ofType(fromRecipeActions.STORE_RECIPES)),
        switchMap(() => {
            return this.store.select('recipes')
        }),
        map((recipesState: fromRecipesReducer.State) => {
            return recipesState.recipes
        }),
        switchMap((recipes: Recipe[]) => {
            return this.httpClient.put(
                'https://ng-course-recipe-book-ed9b7.firebaseio.com/recipes.json',
                recipes
            )
        })
        // withLatestFrom(this.store.select('recipes')),
        // switchMap(([actionData, recipesState]) => {
        //     return this.httpClient.put(
        //         'https://ng-course-recipe-book-ed9b7.firebaseio.com/recipes.json',
        //         recipesState.recipes
        //     );
        // })
    )

    constructor(
        private actions$: Actions,
        private httpClient: HttpClient,
        private store: Store<fromAppReducer.AppState>
    ) {}
}