import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ShoppingComponent} from "./shopping.component";
import {ShoppingFormComponent} from "./shopping-form/shopping-form.component";

const routes: Routes = [
  {
    path: '',
    component: ShoppingComponent,
    children: [{
      path: ':id',
      component: ShoppingFormComponent
    }]
  },
]

@NgModule({
  imports:[
    RouterModule.forChild(routes)
  ],
  exports:[
    RouterModule
  ]
})
export class ShoppingRoutingModule{

}
