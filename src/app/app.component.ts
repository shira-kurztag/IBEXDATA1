import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavComponent } from './Component/nav/nav.component';
import { AddingApartmentComponent } from './Component/adding-apartment/adding-apartment.component';

@Component({
  selector: 'app-root',
  // standalone: true,
  imports: [RouterModule, NavComponent],
  template: `
    <app-nav></app-nav>
    <router-outlet></router-outlet>
  `,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ibexdata';
}
