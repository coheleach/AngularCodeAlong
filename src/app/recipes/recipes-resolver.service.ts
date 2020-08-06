import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Recipe } from './recipe.model';
import { DataStorageService } from '../Shared/data-storage.service';
import { RecipesService } from './recipes.service';
import { Store } from '@ngrx/store';
import * as fromAppReducer from '../store/app.reducer';
import * as fromRecipeActions from './store/recipes.actions';
import * as fromRecipesReducer from './store/recipes.reducer';
import { map } from 'rxjs/internal/operators/map';
import { switchMap, take } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';

@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<Recipe[]> {

    constructor(
        private dataStorageService: DataStorageService,
        private recipesService: RecipesService,
        private store: Store<fromAppReducer.AppState>,
        private actions$: Actions
    ) {}

    resolve(route: ActivatedRouteSnapshot, 
            state: RouterStateSnapshot) {
                // if(this.recipesService.getRecipes().length === 0)
                // {
                //     return this.dataStorageService.fetchRecipes();
                // } else {
                //     return this.recipesService.getRecipes();
                // }
                return this.store.select('recipes').pipe(
                    take(1),
                    switchMap((recipesState: fromRecipesReducer.State) => {
                        if(recipesState.recipes.length === 0) {
                            //return this.dataStorageService.fetchRecipes();
                            this.store.dispatch(new fromRecipeActions.FetchRecipes());
                            return this.actions$.pipe(
                                ofType(fromRecipeActions.SET_RECIPES),
                                take(1)//,
                                // map((recipes: Recipe[]) => {
                                //     return recipes;
                                // })
                            )
                        } else {
                            return of(recipesState.recipes);
                        }
                    })
                )
            }
}