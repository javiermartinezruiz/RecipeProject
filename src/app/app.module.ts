import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { RecipesComponent } from './recipes/recipes.component';
import { ShoppingComponent } from './shopping/shopping.component';
import { RecipeListComponent } from './recipes/recipe-list/recipe-list.component';
import { RecipeFormComponent } from './recipes/recipe-form/recipe-form.component';
import { ShoppingFormComponent } from './shopping/shopping-form/shopping-form.component';
import { RecipeItemComponent } from './recipes/recipe-list/recipe-item/recipe-item.component';
import {FormsModule} from "@angular/forms";
import {DropdownDirective} from "./shared/dropdown.directive";
import { Dropdown2Directive } from './shared/dropdown2.directive';
import { Dropdown3Directive } from './shared/dropdown3.directive';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RecipesComponent,
    ShoppingComponent,
    RecipeListComponent,
    RecipeFormComponent,
    ShoppingFormComponent,
    RecipeItemComponent,
    DropdownDirective,
    Dropdown2Directive,
    Dropdown3Directive,
  ],
    imports: [
        BrowserModule,
        FormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
