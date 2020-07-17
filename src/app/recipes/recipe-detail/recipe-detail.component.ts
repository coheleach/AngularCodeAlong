import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipesService } from '../recipes.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  recipe: Recipe
  id: number

  constructor(
    private recipesService: RecipesService,
    private activedRoute: ActivatedRoute,
    private router: Router            
  ) { }

  ngOnInit() {
    this.activedRoute.params.subscribe(
      (params: Params) => {
        this.id = Number(params['id']);
        this.recipe = this.recipesService.getRecipe(this.id);
      }
    )
  }

  onAddToShoppingList() {
    // this.recipesService.addIngredientsToShoppingList(
    //   this.recipe.ingredients
    // );
  }

  onEditRecipe() {
    this.router.navigate(['recipes', this.id, 'edit']);
  }

  onDeleteRecipe() {
    this.recipesService.deleteRecipe(this.id);
    this.router.navigate(['recipes']);
  }

}
