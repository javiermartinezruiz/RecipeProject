import {Recipe} from "./recipe.model";
import {Ingredient} from "../shared/ingredient.model";
import {Subject} from "rxjs";
import {exhaustMap, map, take, tap} from "rxjs/operators";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {AuthService} from "../auth/auth.service";
import * as fromApp from './../store/app.reducer';
import { Store } from '@ngrx/store';
import * as ShoppingActions from '../shopping/store/shopping.actions';


@Injectable()
export class RecipeService {

  url = 'https://ng-recipe-project-a4694.firebaseio.com/recipes.json';
  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [];
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    public store: Store<fromApp.AppState>) {
    this.fetchData();
  }

  getRecipes(){
    //Se obtiene una copia y no la referencia directa
    return this.recipes.slice();
  }

  getRecipeById(index: number): Recipe{
    return this.recipes[index];
  }

  addRecipe(recipe: Recipe){
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, recipe: Recipe){
    this.recipes[index] = recipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number){
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }

  replaceIngredients(ingredients: Ingredient[]){
    this.store.dispatch(new ShoppingActions.AddIngredients(ingredients));
  }

  saveData(){
    return this.httpClient.put(this.url, this.recipes);
  }

  fetchData(){
    return this.httpClient
    .get<Recipe[]>(this.url)
    .pipe(
      map(recipes => {
        return recipes.map(recipe => {
          return {
            ...recipe,
            ingredients: recipe.ingredients?recipe.ingredients:[]
          }
        });
      }),
      tap(recipes => {
        this.setRecipes(recipes);
      })
    )

  }

  setRecipes(recipes: Recipe[]){
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

}
