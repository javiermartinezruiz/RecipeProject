import {NgModule} from "@angular/core";
import {ShoppingComponent} from "./shopping.component";
import {ShoppingFormComponent} from "./shopping-form/shopping-form.component";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {ShoppingRoutingModule} from "./shopping-routing.module";
import {SharedModule} from "../shared/shared.module";

@NgModule({
  declarations:[
    ShoppingComponent,
    ShoppingFormComponent,
  ],
  imports:[
    FormsModule,
    RouterModule,
    ShoppingRoutingModule,
    SharedModule
  ]
})
export class ShoppingModule{

}
