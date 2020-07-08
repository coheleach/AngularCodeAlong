import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipesResolverService } from './recipes-resolver.service';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { SelectRecipeComponent } from './select-recipe/select-recipe.component';
import { RecipesComponent } from './recipes.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
        { path: 'recipes', component: RecipesComponent, canActivate: [AuthGuard], children: [
            { path: '', component: SelectRecipeComponent },
            { path: 'new', component: RecipeEditComponent },
            { path: ':id', component: RecipeDetailComponent, resolve: [RecipesResolverService] },
            { path: ':id/edit', component: RecipeEditComponent, resolve: [RecipesResolverService] }
            ] 
        }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class RecipesRoutingModule { }