import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Ingredient} from "../../shared/ingredient.model";
import {ShoppingService} from "../shopping.service";
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-shopping-form',
  templateUrl: './shopping-form.component.html',
  styleUrls: ['./shopping-form.component.css']
})
export class ShoppingFormComponent implements OnInit, OnDestroy {

  @ViewChild('f') theForm: NgForm;
  subscription: Subscription;
  editedItemIndex: number;
  editMode: boolean = false;
  editedItem: Ingredient;

  constructor(private shoppingService: ShoppingService) { }

  ngOnInit(): void {
    this.subscription = this.shoppingService.startedEditing.subscribe(
      (index:number)=>{
        this.editMode = true;
        this.editedItemIndex = index;
        this.editedItem = this.shoppingService.getIngredient(index);
        this.theForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        })
      }
    )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onAddItem(form: NgForm){
      const value = form.value;
      const ingredient = new Ingredient(value.name, value.amount);
      if(this.editMode){
        this.shoppingService.updateIngredient(this.editedItemIndex, ingredient);
      }else{
        this.shoppingService.addIngredient(ingredient);
      }
      this.editMode = false;
      form.reset();

  }

  onClear(){
    this.editMode = false;
    this.theForm.reset();
  }

  onDelete(){
    console.log("Deleting...", this.editedItemIndex);
    this.theForm.reset();
    this.shoppingService.deleteIngredient(this.editedItemIndex);
  }

}
