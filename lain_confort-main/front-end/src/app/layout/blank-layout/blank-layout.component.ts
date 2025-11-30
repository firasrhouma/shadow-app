import { Component } from '@angular/core';
import { NavigationEnd, RouterOutlet } from '@angular/router';
import { BlankNavbarComponent } from '../../component/blank-navbar/blank-navbar.component';
import { FooterComponent } from '../../component/footer/footer.component';
import { filter } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
// import { FooterComponent } from '../../component/footer/footer.component';

@Component({
  selector: 'app-blank-layout',
  imports: [RouterOutlet, BlankNavbarComponent, FooterComponent, CommonModule],
  templateUrl: './blank-layout.component.html',
  styleUrl: './blank-layout.component.css',
})
export class BlankLayoutComponent {
  isDashboard = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.isDashboard = this.router.url.startsWith('/dashboard');

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isDashboard = event.urlAfterRedirects.startsWith('/dashboard');
      });
  }
}
