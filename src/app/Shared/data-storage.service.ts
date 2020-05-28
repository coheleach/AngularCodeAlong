import { Recipe } from '../recipes/recipe.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RecipesService } from '../recipes/recipes.service';

@Injectable({providedIn: 'root'})
export class DataStorageService {

    recipesCollected = new Subject<Recipe[]>();

    constructor(private httpClient: HttpClient, 
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
}