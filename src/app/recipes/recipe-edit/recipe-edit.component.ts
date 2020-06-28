import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Subject, Subscription} from "rxjs";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {Recipe} from "../recipe.model";
import * as fromApp from '../../store/app.reducer';
import * as RecipesActions from '../store/recipe.actions';


@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {

  id: number;
  editMode = false;
  subscription: Subscription;
  recipeForm: FormGroup;

  private storeSub: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.subscription = this.activatedRoute.params.subscribe(
      (params:Params)=> {
        this.id = +params['id'];
        this.editMode = params['id'] != null;

        this.initForm();

      }
    )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if(this.storeSub){
      this.storeSub.unsubscribe();
    }
  }

  private initForm(){
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if(this.editMode){
     this.storeSub = this.store.select('recipes').pipe(map(recipeState => {
        return recipeState.recipes.find((recipe, index)=>{
          return index === this.id;
        })
      })).subscribe(recipe=>{
        recipeName = recipe.name;
        recipeDescription = recipe.description;
        recipeImagePath = recipe.imagePath;
        if(recipe['ingredients']){
          for(let ingredient of recipe.ingredients){
            recipeIngredients.push(new FormGroup({
              'name':new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(ingredient.amount, [
                  Validators.required,
                  Validators.pattern(/^[1-9]+[0-9]*$/)]
              )
            }));
          }
        }
      });
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients
    });

  }

  onSubmit(){
    const recipe = new Recipe(
      this.recipeForm.value['name'],
      this.recipeForm.value['description'],
      this.recipeForm.value['imagePath'],
      this.recipeForm.value['ingredients']);
    if(this.editMode){
      this.store.dispatch(new RecipesActions.UpdateRecipe({index: this.id, recipe: this.recipeForm.value}))
    }else{
      this.store.dispatch(new RecipesActions.AddRecipe(this.recipeForm.value));
    }

    this.router.navigate(['../'], {relativeTo:this.activatedRoute});

  }

  onCancel(){
    this.router.navigate(['../'], {relativeTo:this.activatedRoute});
  }

  get controls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onAddIngredient(){
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null,[
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      })
    )
  }

  onDeleteIngredient(index:number){
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }



}
