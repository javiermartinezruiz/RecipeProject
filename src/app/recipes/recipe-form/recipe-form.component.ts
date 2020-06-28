import { DeleteRecipe } from './../store/recipe.actions';
import { map, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Recipe} from "../recipe.model";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Subscription} from "rxjs";
import * as fromApp from '../../store/app.reducer';
import * as RecipesActions from '../store/recipe.actions';
import * as ShoppingActions from '../../shopping/store/shopping.actions';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.css']
})
export class RecipeFormComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  recipe: Recipe;
  id: number;

  constructor(
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.subscription = this.activatedRoute.params.pipe(
        map(params => {
          return +params['id'];
        }),
        switchMap(id => {
          this.id = id;
          return this.store.select('recipes');
        }),
        map(recipesState => {
          return recipesState.recipes.find((recipe, index) => {
            return index === this.id;
          });
        })
      ).subscribe(recipe => {
          this.recipe = recipe;
      });
  }

  ngOnDestroy() {
    // Esto no es necesario para esta subscripcion porque angular lo hace por mi
    // pero las subscripciones propias debe eliminarse
    this.subscription.unsubscribe();
  }

  onAddToShoppingList(){
    console.log('Adding ingredients: ', this.recipe.ingredients);
    this.store.dispatch(new ShoppingActions.AddIngredients(this.recipe.ingredients));
  }

  onEditRecipe(){
    this.router.navigate(['edit'], {relativeTo: this.activatedRoute})
    // this.router.navigate(['../', this.id], {relativeTo:this.activatedRoute});
  }

  onDeleteRecipe(){
    //Another way using the active route
    //const index = this.activatedRoute.snapshot.params.id;
    //this.recipeService.deleteRecipe(this.id);
    this.store.dispatch(new RecipesActions.DeleteRecipe(this.id));
    this.router.navigate(['/recipes']);
  }

}
