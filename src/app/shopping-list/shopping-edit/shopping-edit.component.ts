import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Ingredient } from 'src/app/Shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  @ViewChild('form', {static: true}) form: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedIngredient: Ingredient;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit() {
    this.subscription = this.shoppingListService.ingredientSelected.subscribe(
      (index: number) => {
        this.editedItemIndex = index;
        this.editMode = true;
        this.editedIngredient = this.shoppingListService.getIngredient(this.editedItemIndex);
        this.form.setValue({
          name: this.editedIngredient.name,
          amount: this.editedIngredient.amount
        });
      }
    )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onAddIngredient(form: NgForm) {
    const values = form.value;
    const newIngredient = new Ingredient(values.name, values.amount);
    if(this.editMode) {
      this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient);
    } else {
      this.shoppingListService.addIngredient(newIngredient);
    }
    this.clearForm();
  }

  clearForm() {
    this.editedItemIndex = -1;
    this.editedIngredient = null;
    this.editMode = false;
    this.form.reset();
  }


}
