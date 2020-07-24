import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../Shared/ingredient.model';
import {Subscription, Observable} from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from './store/shopping-list.actions';
import * as fromShoppingList from './store/shopping-list.reducer';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  ingredients: Observable<{ingredients: Ingredient[]}>
  subscription: Subscription;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList');
  }

  ngOnDestroy() {}

  onEditItem(index: number) {
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }

}
