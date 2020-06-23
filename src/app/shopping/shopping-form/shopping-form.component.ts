import { StopEdit } from './../store/shopping.actions';
import { Ingredient } from './../../shared/ingredient.model';
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingActions from '../store/shopping.actions';
import * as fromApp from './../../store/app.reducer';

@Component({
  selector: 'app-shopping-form',
  templateUrl: './shopping-form.component.html',
  styleUrls: ['./shopping-form.component.css']
})
export class ShoppingFormComponent implements OnInit, OnDestroy {

  @ViewChild('f') theForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItem: Ingredient;

  constructor(
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {

    this.subscription = this.store.select('shopping').subscribe(stateData => {
      if (stateData.editedIngredientIndex > -1){
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        this.theForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      }else{
        this.editMode = false;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingActions.StopEdit());
  }

  onAddItem(form: NgForm){
      const value = form.value;
      const newIngredient = new Ingredient(value.name, value.amount);
      if(this.editMode){
        this.store.dispatch(
          new ShoppingActions.UpdateIngredient(newIngredient)
        );
      }else{
        this.store.dispatch(
          new ShoppingActions.AddIngredient(newIngredient)
        );
      }
      this.editMode = false;
      form.reset();

  }

  onClear(){
    this.editMode = false;
    this.theForm.reset();
    this.store.dispatch(new ShoppingActions.StopEdit());
  }

  onDelete(){
    console.log('Deleting...');
    this.theForm.reset();
    this.store.dispatch(new ShoppingActions.DeleteIngredient());
  }

}
