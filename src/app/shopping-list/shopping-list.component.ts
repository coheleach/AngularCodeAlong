import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../Shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import {Subscription, Observable} from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  //ingredients: Ingredient[];
  ingredients: Observable<{ingredients: Ingredient[]}>
  subscription: Subscription;

  constructor(
    private shoppingListService: ShoppingListService,
    private store: Store<{ shoppingList: {ingredients: Ingredient[]}}>
    ) { }

  ngOnInit() {
    //this.ingredients = this.shoppingListService.getIngredients();
    this.ingredients = this.store.select('shoppingList');
    // this.subscription = this.shoppingListService.ingredientsChanged.subscribe(
    //   (ingredients: Ingredient[]) => { this.ingredients = ingredients; }
    // )
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }

  onEditItem(index: number) {
    // this.shoppingListService.editIngredient(index);
  }

}
