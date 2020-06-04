
import { Recipe } from '../recipes/recipe.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RecipesService } from '../recipes/recipes.service';
import { map, tap, exhaustMap, take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({providedIn: 'root'})
export class DataStorageService {

    constructor(private httpClient: HttpClient, 
                private authService: AuthService,
                private recipesService: RecipesService) {} 

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
        // return this.authService.user.pipe(take(1), exhaustMap(user => {
        //     return this.httpClient.get<Recipe[]>(
        //         'https://ng-course-recipe-book-ed9b7.firebaseio.com/recipes.json',
        //         {
        //             params: new HttpParams().set('auth',user.token)
        //         })
        //     }),
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
            this.recipesService.setRecipes(recipes);
        }));
    }
}