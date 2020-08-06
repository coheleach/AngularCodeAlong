import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipesService } from '../recipes.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromAppReducer from '../../store/app.reducer';
import * as fromRecipesActions from '../store/recipes.actions';
import * as fromRecipesReducer from '../store/recipes.reducer';
import { map, tap, exhaustMap, switchMap } from 'rxjs/operators';

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
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: Store<fromAppReducer.AppState>
  ) { }

  ngOnInit() {
    // this.activatedRoute.params.subscribe(
    //   (params: Params) => {
    //     this.id = Number(params['id']);
    //     //this.recipe = this.recipesService.getRecipe(this.id);
    //     this.store.select('recipes').pipe(
    //       map((recipesState: fromRecipesReducer.State) => {
    //         return recipesState.recipes.find((recipe, index) => {
    //           index = this.id;
    //         })
    //       })
    //     )
    //   }
    // )
    this.activatedRoute.params.pipe(
      map((params: Params) => {
        return Number(params['id']);
      }),
      switchMap((id: number) => {
        this.id = id;
        return this.store.select('recipes');
      }),
      map((recipesState: fromRecipesReducer.State) => {
        return recipesState.recipes.find((recipe, index) => {
          return index === this.id;
        })
      })
    ).subscribe((recipe: Recipe) => {
      this.recipe = recipe;
    })
  }

  onAddToShoppingList() {
    this.recipesService.addIngredientsToShoppingList(
      this.recipe.ingredients
    );
  }

  onEditRecipe() {
    this.router.navigate(['recipes', this.id, 'edit']);
  }

  onDeleteRecipe() {
    //this.recipesService.deleteRecipe(this.id);
    this.store.dispatch(new fromRecipesActions.DeleteRecipe(this.id));
    this.router.navigate(['recipes']);
  }

}
