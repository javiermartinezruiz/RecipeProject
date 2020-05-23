import {Ingredient} from "../shared/ingredient.model";
import {EventEmitter} from "@angular/core";

export class ShoppingService {

  ingredientsChanged = new EventEmitter<Ingredient[]>();

  private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 20)
  ];

  constructor() { }

  addIngredient(ingredient: Ingredient){
    this.ingredients.push(ingredient);
    this.ingredientsChanged.emit(this.ingredients.slice());
  }

  replaceIngredients(ingredients: Ingredient[]){
    this.ingredients.push(...ingredients);
  }

  getIngredients(){
    //Retorna una copia y no la referencia directa
    return this.ingredients.slice();
  }

}
