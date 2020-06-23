import { StartEdit } from './store/shopping.actions';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Ingredient} from "../shared/ingredient.model";
import {Subscription, Observable} from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingActions from './store/shopping.actions';
import * as fromApp from './../store/app.reducer';


@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.css'],
})
export class ShoppingComponent implements OnInit, OnDestroy {

  ingredients: Observable<{ ingredients: Ingredient[] }>;
  // private subscription: Subscription;

  constructor(
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    this.ingredients = this.store.select('shopping');
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }

  onEditItem(index: number){
    this.store.dispatch(new ShoppingActions.StartEdit(index));
  }

}
