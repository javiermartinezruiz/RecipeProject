import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {RecipesComponent} from "./recipes/recipes.component";
import {ShoppingComponent} from "./shopping/shopping.component";
import {RecipeFormComponent} from "./recipes/recipe-form/recipe-form.component";
import {ShoppingFormComponent} from "./shopping/shopping-form/shopping-form.component";
import {RecipeDefaultComponent} from "./recipes/recipe-default/recipe-default.component";
import {RecipeEditComponent} from "./recipes/recipe-edit/recipe-edit.component";

const routes: Routes = [
  {path:'', redirectTo:'/recipes', pathMatch: 'full'},
  {
    path: 'recipes',
    component: RecipesComponent,
    children: [
      {
        path: '',
        component: RecipeDefaultComponent
      },
      {
        path: 'new',
        component: RecipeEditComponent
      },
      {
        path: ':id',
        component: RecipeFormComponent
      },
      {
        path: ':id/edit',
        component: RecipeEditComponent
      }
    ]
  },
  {
    path: 'shopping',
    component: ShoppingComponent,
    children: [{
        path: ':id',
        component: ShoppingFormComponent
    }]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule{

}
