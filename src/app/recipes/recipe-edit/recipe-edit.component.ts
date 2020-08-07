import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Recipe } from '../recipe.model';
import { Store } from '@ngrx/store';
import * as fromAppReducer from '../../store/app.reducer';
import * as fromRecipesReducer from '../store/recipes.reducer';
import * as fromRecipesActions from '../store/recipes.actions';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {

  editMode = false;
  id: number;
  recipeForm: FormGroup;
  storeSubscription: Subscription;

  get ingredientsAsControls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: Store<fromAppReducer.AppState>
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.editMode = (params['id'] != null ? true : false);
        if(this.editMode) {
          this.id = Number(params['id']);
        }
        this.formInit();
      }
    )
  }

  ngOnDestroy() {
    this.storeSubscription.unsubscribe();
  }

  private formInit() {
    let recipeName = '';
    let recipeImagePath = '';
    let description = '';
    let recipeIngredients = new FormArray([]);

    if(this.editMode) {
      //const recipe = this.recipesService.getRecipe(this.id);
      this.storeSubscription = this.store.select('recipes').pipe(
        map((recipesState: fromRecipesReducer.State) => {
          return recipesState.recipes.find((recipe, index) => {
            return this.id === index;
          })
        })
      ).subscribe((recipe: Recipe) => {
       recipeName = recipe.name;
        recipeImagePath = recipe.filePath;
        description = recipe.description;
        if(recipe.ingredients) {
          for(let ingredient of recipe.ingredients) {
            recipeIngredients.push(new FormGroup({
              'name': new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*/)
              ])
            }))
          }
        }
      });
    }    
    
    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(description, Validators.required),
      'ingredients': recipeIngredients
    });
  }

  onSubmit() {
    console.log(this.recipeForm);

    if(this.editMode) {
      // this.recipesService.updateRecipe(
      //   new Recipe(
      //     this.recipeForm.value.name,
      //     this.recipeForm.value.description,
      //     this.recipeForm.value.imagePath,
      //     this.recipeForm.value.ingredients
      //   ),
      //   this.id
      // )
      this.store.dispatch(new fromRecipesActions.UpdateRecipe( 
        {
          recipe: new Recipe(
            this.recipeForm.value.name,
            this.recipeForm.value.description,
            this.recipeForm.value.imagePath,
            this.recipeForm.value.ingredients
          ),
          index: this.id
        }
      ))
    } else {
      this.store.dispatch(new fromRecipesActions.AddRecipe(
        new Recipe(
          this.recipeForm.value.name,
          this.recipeForm.value.description,
          this.recipeForm.value.imagePath,
          this.recipeForm.value.ingredients
        )
      ))
      // this.recipesService.addRecipe(
      //   new Recipe(
      //     this.recipeForm.value.name,
      //     this.recipeForm.value.description,
      //     this.recipeForm.value.imagePath,
      //     this.recipeForm.value.ingredients
      //   )
      // )
    }

    this.navigateBack();
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*/)
        ]),
      })
    );
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  onCancel() {
    this.navigateBack();
  }

  private navigateBack() {
    this.router.navigate(['../'], {relativeTo: this.activatedRoute});
  }
}
