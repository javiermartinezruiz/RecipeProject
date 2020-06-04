import {Recipe} from "./recipe.model";
import {Ingredient} from "../shared/ingredient.model";
import {Subject} from "rxjs";
import {exhaustMap, map, take, tap} from "rxjs/operators";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {AuthService} from "../auth/auth.service";

@Injectable()
export class RecipeService {

  url: string = 'https://ng-recipe-project-a4694.firebaseio.com/recipes.json';
  recipesChanged = new Subject<Recipe[]>();


  /*private recipes: Recipe[] = [
    new Recipe(
      'A Test Recipe',
      'This is a test',
      'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_960_720.jpg',
      [
        new Ingredient('Meat', 1),
        new Ingredient('Fries', 20)
      ]
    ),
    new Recipe(
      'Another test recipe',
      'this is another test',
      'https://get.pxhere.com/photo/dish-food-recipe-snack-fast-food-cuisine-sandwich-vegetarian-food-baked-goods-power-supply-junk-food-beirut-mediterranean-food-finger-food-european-food-breakfast-sandwich-american-food-1375814.jpg',
      [
        new Ingredient('Meat', 2),
        new Ingredient('Onions', 10)
      ])
  ];*/

  private recipes: Recipe[] = [];
  constructor(private httpClient: HttpClient, private authService: AuthService) {
    this.fetchData();
  }

  getRecipes(){
    //Se obtiene una copia y no la referencia directa
    return this.recipes.slice();
  }

  getRecipeById(index: number): Recipe{
    return this.recipes[index];
  }

  addRecipe(recipe:Recipe){
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index:number, recipe:Recipe){
    this.recipes[index] = recipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number){
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }

  saveData(){
    return this.httpClient.put(this.url, this.recipes);
  }

  fetchData(){
    return this.authService.user.pipe(
      take(1),  //subscribe, take 1 result and unsubscribe automatically
      exhaustMap(user=> { //replace the observable
        return this.httpClient.get<Recipe[]>(this.url, {
          params: new HttpParams().set('auth', user.token)
        })
      }),
      map(recipes=>{
        return recipes.map(recipe=>{
          return {
            ...recipe,
            ingredients: recipe.ingredients?recipe.ingredients:[]
          }
        })
      }),
      tap(recipes=>{
        this.setRecipes(recipes);
      })
    )

  }

  setRecipes(recipes: Recipe[]){
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

}
