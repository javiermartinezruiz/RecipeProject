import {Component, Input, OnInit} from '@angular/core';
import {Recipe} from "../recipe.model";
import {ShoppingService} from "../../shopping/shopping.service";

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.css']
})
export class RecipeFormComponent implements OnInit {

  @Input() recipe: Recipe;
  constructor(private shoppingService: ShoppingService) { }

  ngOnInit(): void {
  }

  onAddToShoppingList(){
    this.shoppingService.replaceIngredients(this.recipe.ingredients);
  }

}
