import {Directive, ElementRef, HostBinding, HostListener} from '@angular/core';

/**
 * This directive is an example of a dropdown closable from outside
 */
@Directive({
  selector: '[appDropdown3]'
})
export class Dropdown3Directive {
  @HostBinding('class.open') isOpen = false;

  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    console.log("Event: ", event)
    this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
  }

  constructor(private elRef: ElementRef) {}
}
