import { Actions, Effect, ofType } from '@ngrx/effects';
import * as fromRecipeActions from './recipes.actions';
import { tap, switchMap, map } from 'rxjs/operators';
import { DataStorageService } from 'src/app/Shared/data-storage.service';
import { Recipe } from '../recipe.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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

    constructor(
        private actions$: Actions,
        private httpClient: HttpClient
    ) {}
}