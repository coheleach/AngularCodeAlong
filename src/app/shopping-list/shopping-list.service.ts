import {Injectable, EventEmitter} from '@angular/core';
import {Ingredient} from './../Shared/ingredient.model';
import {Subject} from 'rxjs';

@Injectable()
export class ShoppingListService {

    ingredientsChanged = new Subject<Ingredient[]>();
    ingredientSelected = new Subject<number>();

    //TODO: Add centralized array of Shopping List items
    private ingredients: Ingredient[] = [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10)
    ];

    getIngredients() {
        return this.ingredients.slice();
    }

    getIngredient(index: number) {
        return this.ingredients[index];
    }
    
    //TODO: configure crud configurations for array 
    addIngredient(ingredient: Ingredient) {
        this.ingredients.push(ingredient);
        this.ingredientsChanged.next(this.getIngredients());
    }

    addIngredients(ingredients: Ingredient[]) {
        this.ingredients = this.ingredients.concat(ingredients);
        this.ingredientsChanged.next(this.getIngredients());
    }

    editIngredient(index: number) {
        this.ingredientSelected.next(index);
    }

    updateIngredient(index: number, newIngredient: Ingredient) {
        this.ingredients[index] = newIngredient;
        this.ingredientsChanged.next(this.getIngredients());
    }

    //TODO: replace events
}
