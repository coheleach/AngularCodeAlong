import {Directive, Input, HostBinding, HostListener, ElementRef} from '@angular/core';

@Directive({
    selector: '[appDropdown]'
})
export class DropdownDirective {

    // @Input() clickClass: string;
     @HostBinding('class.open') isOpen = false;

    constructor() { }
    
    @HostListener('click') onClick() {
        this.isOpen = !this.isOpen;
    } 

}