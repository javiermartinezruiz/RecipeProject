import {Directive, HostBinding, HostListener} from '@angular/core';

/**
 * This directive is an example of @Hostbinding
 */
@Directive({
  selector: '[appDropdown2]'
})
export class Dropdown2Directive {

  @HostBinding('class.open') isOpen = false;
  constructor() { }

  @HostListener('click') toogleOpen(){
    this.isOpen = !this.isOpen;
  }

}
