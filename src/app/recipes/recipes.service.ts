import {Injectable, EventEmitter} from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../Shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable()
export class RecipesService {
    
    private recipes: Recipe[] = [
        new Recipe(
            'Moroccan Chickpea Bowl', 
            'mildly filling plate of chickpeas',
            'https://pinchofyum.com/wp-content/uploads/Moroccan-Chickpea-Bowls-Recipe.jpg',
            [
                new Ingredient('Chickpea', 18),
                new Ingredient('Pita slice', 3),
                new Ingredient('Cucumber', 1)
            ]
            ),
        new Recipe(
        'Kung Pao Chicken', 
        'Sweet & Sour Chicken with Sesame Seeds',
        'https://www.rockrecipes.com/wp-content/uploads/2012/04/Double-Crunch-Honey-Garlic-Chicken-Breasts-edit2-1.jpg',
        [
            new Ingredient('Chicken Lump', 9),
            new Ingredient('Sesame Seed', 82)
        ]
      )
    ];
    
    constructor(private shoppingListService: ShoppingListService) {}
 

    getRecipes() {
        return this.recipes.slice()
    }

    getRecipe(index: number) {
        return this.recipes[index];
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.shoppingListService.addIngredients(ingredients);
    }
}