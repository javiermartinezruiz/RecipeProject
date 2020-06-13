import {NgModule} from "@angular/core";
import {AlertComponent} from "./alert/alert.component";
import {LoadingSpinnerComponent} from "./loading-spinner/loading-spinner.component";
import {PlaceholderDirective} from "./placeholder.directive";
import {CommonModule} from "@angular/common";
import {DropdownDirective} from "./dropdown.directive";
import {Dropdown3Directive} from "./dropdown3.directive";

@NgModule({
  declarations: [
    AlertComponent,
    LoadingSpinnerComponent,
    PlaceholderDirective,
    DropdownDirective,
    Dropdown3Directive
  ],
  imports:[
    CommonModule
  ],
  exports: [
    AlertComponent,
    LoadingSpinnerComponent,
    PlaceholderDirective,
    DropdownDirective,
    Dropdown3Directive,
    CommonModule
  ]
})
export class SharedModule{

}
