import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent {
  openDropdown: 'forms' | 'charts' | 'ui' | 'auth' | 'tables' | 'dashboard' | 'customers' | null = null;

  toggleDropdown(section: 'forms' | 'charts' | 'ui' | 'auth' | 'tables' | 'dashboard' | 'customers'): void {
    this.openDropdown = this.openDropdown === section ? null : section;
  }

  isOpen(section: 'forms' | 'charts' | 'ui' | 'auth' | 'tables'| 'dashboard' | 'customers '): boolean {
    return this.openDropdown === section;
  }
}

