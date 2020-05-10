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

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit() {
    this.subscription = this.shoppingListService.ingredientSelected.subscribe(
      (index: number) => {
        this.editedItemIndex = index;
        this.editMode = true;
      }
    )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onAddIngredient(form: NgForm) {

    this.shoppingListService.addIngredient(new Ingredient(
      form.value.name,
      form.value.amount
    ));
  }

}
