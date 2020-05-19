import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipesService } from '../recipes.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {

  recipes: Recipe[];
  recipesSubscription: Subscription;
  
  constructor(private recipesService: RecipesService,
              private router: Router) { }

  ngOnInit() {
    this.recipes = this.recipesService.getRecipes();
    this.recipesSubscription = this.recipesService.recipesChanged.subscribe(
      (recipes) => {
        this.recipes = recipes;
      }
    )
  }

  ngOnDestroy() {
    this.recipesSubscription.unsubscribe();
  }

  onNewRecipe() {
    this.router.navigate(['recipes', 'new']);
  }

}
