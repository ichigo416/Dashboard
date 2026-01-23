import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent implements OnInit {

  role: 'admin' | 'customer' | null = null;

  openDropdown:
    | 'forms'
    | 'charts'
    | 'ui'
    | 'auth'
    | 'tables'
    | 'dashboard'
    | 'customers'
    | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadRole();

      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => this.loadRole());
    }
  }

  private loadRole(): void {
    this.role = localStorage.getItem('role') as 'admin' | 'customer';
  }

  toggleDropdown(
    section:
      | 'forms'
      | 'charts'
      | 'ui'
      | 'auth'
      | 'tables'
      | 'dashboard'
      | 'customers'
  ): void {
    this.openDropdown = this.openDropdown === section ? null : section;
  }

  isOpen(
    section:
      | 'forms'
      | 'charts'
      | 'ui'
      | 'auth'
      | 'tables'
      | 'dashboard'
      | 'customers'
  ): boolean {
    return this.openDropdown === section;
  }
}
