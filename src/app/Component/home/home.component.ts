import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { BreadcrumbModule } from 'primeng/breadcrumb';


@Component({
  standalone: true,
  selector: 'app-home',
  imports: [MenubarModule,BreadcrumbModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  breadcrumbItems!: MenuItem[];

  ngOnInit() {
    //this.loadBanks(); 
   
    this.breadcrumbItems = [
      { label: 'דף הבית', url: '/' },
      // { label: 'רשימת בנקים', url: '/bank' }
    ];
  }
}
