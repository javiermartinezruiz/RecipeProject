import {Directive, ElementRef, HostListener, Renderer2} from "@angular/core";

/**
 * This directive is an example of @HostListener.
 */
@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective{

  private isOpen = false;
  private elementRef;
  private renderer;

  constructor(elementRef: ElementRef, renderer: Renderer2) {
    this.elementRef = elementRef;
    this.renderer = renderer;
  }

  @HostListener('click', ['$event']) toogleOpen(event: Event){
    console.log("Event: ", event);
    if(this.isOpen){
      this.renderer.removeClass(this.elementRef.nativeElement,'open');
    }else{
      this.renderer.addClass(this.elementRef.nativeElement, 'open');
    }
    this.isOpen = !this.isOpen;
  }
}
