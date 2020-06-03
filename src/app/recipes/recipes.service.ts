import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../Shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable()
export class RecipesService {
    
    recipesChanged = new Subject<Recipe[]>();

    private recipes: Recipe[] = [];
    
    constructor(private shoppingListService: ShoppingListService) {}
 

    getRecipes() {
        return this.recipes.slice()
    }

    getRecipe(index: number) {
        return this.recipes[index];
    }

    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
        this.recipesChanged.next(this.getRecipes());
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.shoppingListService.addIngredients(ingredients);
    }

    addRecipe(newRecipe: Recipe) {
        this.recipes.push(newRecipe);
        this.recipesChanged.next(this.getRecipes());
    }

    updateRecipe(updatedRecipe: Recipe, index: number) {
        this.recipes[index] = updatedRecipe;
        this.recipesChanged.next(this.getRecipes());
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.getRecipes());
    }
}