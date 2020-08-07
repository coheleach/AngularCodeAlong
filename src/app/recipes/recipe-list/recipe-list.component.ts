import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from '../recipe.model';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromAppReducer from '../../store/app.reducer';
import * as fromRecipeReducer from '../store/recipes.reducer';
import { take, tap, map } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {

  recipes: Recipe[];
  recipesSubscription: Subscription;
  
  constructor(
    private router: Router,
    private store: Store<fromAppReducer.AppState>
  ) { }

  ngOnInit() {

    this.recipesSubscription = this.store.select('recipes').pipe(
      map((recipesState: fromRecipeReducer.State) => {
        return recipesState.recipes
      }))
      .subscribe((recipes: Recipe[]) => {
        this.recipes = recipes;
      });
    
    // this.recipes = this.recipesService.getRecipes();
    // this.recipesSubscription = this.recipesService.recipesChanged.subscribe(
    //   (recipes) => {
    //     this.recipes = recipes;
    //   }
    // )
  }

  ngOnDestroy() {
    this.recipesSubscription.unsubscribe();
  }

  onNewRecipe() {
    this.router.navigate(['recipes', 'new']);
  }

}
