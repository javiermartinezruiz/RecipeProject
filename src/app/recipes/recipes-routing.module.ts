import {NgModule} from "@angular/core";
import { RouterModule, Routes} from "@angular/router";
import {RecipesComponent} from "./recipes.component";
import {AuthGuard} from "../auth/auth.guard";
import {RecipeDefaultComponent} from "./recipe-default/recipe-default.component";
import {RecipeEditComponent} from "./recipe-edit/recipe-edit.component";
import {RecipeFormComponent} from "./recipe-form/recipe-form.component";
import {RecipesResolverService} from "./recipes-resolver.service";

const routes: Routes = [

  {
    path: '',
    component: RecipesComponent,
    canActivate: [AuthGuard],
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
        component: RecipeFormComponent,
        resolve: [RecipesResolverService]
      },
      {
        path: ':id/edit',
        component: RecipeEditComponent
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipesRoutingModule{

}
