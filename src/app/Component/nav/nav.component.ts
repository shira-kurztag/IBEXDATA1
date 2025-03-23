import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Menubar } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';


@Component({
  standalone: true,
  selector: 'app-nav',
  imports: [MenubarModule, RouterModule, HttpClientModule, CommonModule, Menubar, ButtonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {
  constructor(private activateRoute: ActivatedRoute, private router: Router) { }

  items: MenuItem[] = [];

  ngOnInit() {
    this.items = [
      { label: 'דף הבית', routerLink: ['/home'] },
      { label: 'הפקת אישור זכויות', routerLink: ['/home'] },
      { label: 'הפקת דו"חות', routerLink: ['/home'] },
      { label: 'מסמכים', routerLink: ['/apartmentDetails'] },
      { label: 'ממתינים לטיפול', routerLink: ['/home'] },
      {
        label: 'מאגר מידע',
        items: [
          { label: 'רשימת בנקים', routerLink: ['/bank'] },
          { label: 'רשימת תעריפים', routerLink: ['/fare'] },
          { label: 'רשימת משתמשים', routerLink: ['/users'] },
          { label: 'רשימת קבלנים', routerLink: ['/listcontractor'] }
        ]
      }
    ];
  }

  trackByFn(index: number, item: MenuItem): number {
    return index; // או ניתן להשתמש ב-item.label או כל מזהה ייחודי אחר
  }
}
