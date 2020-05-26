import {Ingredient} from "../shared/ingredient.model";
import {Subject} from "rxjs";

export class ShoppingService {

  ingredientsChanged = new Subject<Ingredient[]>();

  private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 20)
  ];

  constructor() { }

  addIngredient(ingredient: Ingredient){
    this.ingredients.push(ingredient);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  replaceIngredients(ingredients: Ingredient[]){
    this.ingredients.push(...ingredients);
  }

  getIngredients(){
    //Retorna una copia y no la referencia directa
    return this.ingredients.slice();
  }

}
