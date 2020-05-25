import {Component, OnDestroy, OnInit} from '@angular/core';
import {Recipe} from "../recipe.model";
import {ShoppingService} from "../../shopping/shopping.service";
import {RecipeService} from "../recipe.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.css']
})
export class RecipeFormComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  recipe: Recipe;

  constructor(private shoppingService: ShoppingService,
              private recipeService: RecipeService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.subscription = this.activatedRoute.params.subscribe(
      (params:Params)=> {
        this.recipe = this.recipeService.getRecipeById(+params['id']);
      }
    )
  }

  ngOnDestroy() {
    // Esto no es necesario para esta subscripcion porque angular lo hace por mi
    // pero las subscripciones propias debe eliminarse
    this.subscription.unsubscribe();
  }

  onAddToShoppingList(){
    this.shoppingService.replaceIngredients(this.recipe.ingredients);
  }

  onEditRecipe(){
    this.router.navigate(['edit'], {relativeTo: this.activatedRoute})
    // this.router.navigate(['../', this.id], {relativeTo:this.activatedRoute});
  }

}
