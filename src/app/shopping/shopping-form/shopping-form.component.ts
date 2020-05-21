import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Ingredient} from "../../shared/ingredient.model";

@Component({
  selector: 'app-shopping-form',
  templateUrl: './shopping-form.component.html',
  styleUrls: ['./shopping-form.component.css']
})
export class ShoppingFormComponent implements OnInit {

  @Output() selectedIngredient = new EventEmitter<Ingredient>();

  ingredient: Ingredient;
  constructor() { }

  ngOnInit(): void {
  }

  add(name:HTMLInputElement, amount: HTMLInputElement){
    console.log("Name: ", name.value);
    console.log("Amount: ", amount.valueAsNumber);
    this.ingredient = new Ingredient(name.value, amount.valueAsNumber);
    this.selectedIngredient.emit(this.ingredient);
  }

  delete(){
    console.log("Deleting...");
  }

}
