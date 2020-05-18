import { Component, OnInit } from '@angular/core';
import { RecipesService } from '../recipes.service';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

  editMode = false;
  id: number;
  recipeForm: FormGroup;

  get ingredientsAsControls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  constructor(private recipesService: RecipesService,
              private activatedRoute: ActivatedRoute) { }

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

  private formInit() {
    let recipeName = '';
    let recipeImagePath = '';
    let description = '';
    let recipeIngredients = new FormArray([]);

    if(this.editMode) {
      const recipe = this.recipesService.getRecipe(this.id);
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
      this.recipesService.updateRecipe(
        new Recipe(
          this.recipeForm.value.name,
          this.recipeForm.value.description,
          this.recipeForm.value.imagePath,
          this.recipeForm.value.ingredients
        ),
        this.id
      )
    } else {
      this.recipesService.addRecipe(
        new Recipe(
          this.recipeForm.value.name,
          this.recipeForm.value.description,
          this.recipeForm.value.imagePath,
          this.recipeForm.value.ingredients
        )
      )
    }
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

}
