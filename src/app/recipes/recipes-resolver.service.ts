import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Recipe } from './recipe.model';
import { DataStorageService } from '../Shared/data-storage.service';
import { RecipesService } from './recipes.service';

@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<Recipe[]> {

    constructor(private dataStorageService: DataStorageService,
                private recipesService: RecipesService) {}

    resolve(route: ActivatedRouteSnapshot, 
            state: RouterStateSnapshot) {
                if(this.recipesService.getRecipes().length === 0)
                {
                    return this.dataStorageService.fetchRecipes();
                } else {
                    return this.recipesService.getRecipes();
                }
            }
}