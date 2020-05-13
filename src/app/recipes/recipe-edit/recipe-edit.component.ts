import { Component, OnInit } from '@angular/core';
import { RecipesService } from '../recipes.service';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, FormArray } from '@angular/forms';

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
            'name': new FormControl(ingredient.name),
            'amount': new FormControl(ingredient.amount)
          }))
        }
      }
    }
    
    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName),
      'imagePath': new FormControl(recipeImagePath),
      'description': new FormControl(description),
      'ingredients': recipeIngredients
    });
  }

  onSubmit() {
    console.log(this.recipeForm);
  }

}
