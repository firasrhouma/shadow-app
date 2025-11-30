import { Component, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-nav-links',
  imports: [],
  templateUrl: './nav-links.component.html',
  styleUrl: './nav-links.component.css'
})
export class NavLinksComponent {
  @Input() url!:string;
}
