import { Component, OnInit } from '@angular/core';
import { RecipesService } from '../recipes.service';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

  editMode = false;
  id: number;
  form: FormGroup;

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

    if(this.editMode) {
      const recipe = this.recipesService.getRecipe(this.id);
      recipeName = recipe.name;
      recipeImagePath = recipe.filePath;
      description = recipe.description;
    }
    
    this.form = new FormGroup({
      'name': new FormControl(recipeName),
      'imagePath': new FormControl(recipeImagePath),
      'description': new FormControl(description),
      'ingredients': null
    });
  }

}
