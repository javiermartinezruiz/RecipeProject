import {Component, OnInit} from '@angular/core';
import {Ingredient} from "../../shared/ingredient.model";
import {ShoppingService} from "../shopping.service";

@Component({
  selector: 'app-shopping-form',
  templateUrl: './shopping-form.component.html',
  styleUrls: ['./shopping-form.component.css']
})
export class ShoppingFormComponent implements OnInit {

  ingredient: Ingredient;
  constructor(private shoppingService: ShoppingService) { }

  ngOnInit(): void {
  }

  add(name:HTMLInputElement, amount: HTMLInputElement){
    this.ingredient = new Ingredient(name.value, amount.valueAsNumber);
    this.shoppingService.addIngredient(this.ingredient);
  }

  delete(){
    console.log("Deleting...");
  }

}
