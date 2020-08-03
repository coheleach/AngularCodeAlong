import { Recipe } from '../recipes/recipe.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RecipesService } from '../recipes/recipes.service';
import { map, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import * as fromrecipesActions from '../recipes/store/recipes.actions';
import * as fromAppReducer from '../store/app.reducer';
import { Store } from '@ngrx/store';

@Injectable({providedIn: 'root'})
export class DataStorageService {

    constructor(
        private httpClient: HttpClient, 
        private authService: AuthService,
        private recipesService: RecipesService,
        private store: Store<fromAppReducer.AppState>
    ) {} 

    storeRecipes() {
        const recipes = this.recipesService.getRecipes();
        this.httpClient.put(
            'https://ng-course-recipe-book-ed9b7.firebaseio.com/recipes.json',
            recipes
        )
        .subscribe(serverResponse => {
            console.log(serverResponse);
        })
    }

    fetchRecipes() {
        return this.httpClient.get<Recipe[]>(
            'https://ng-course-recipe-book-ed9b7.firebaseio.com/recipes.json'
        )
        .pipe(map(serverResponseBody => {
                return serverResponseBody.map(recipeElement => {
                return {...recipeElement, 
                    ingredients: recipeElement['ingredients'] ? recipeElement['ingredients'] : []};
            })
        }),
        tap(recipes => {
            this.store.dispatch(new fromrecipesActions.SetRecipes(recipes))           
            //this.recipesService.setRecipes(recipes);
        }));
    }
}