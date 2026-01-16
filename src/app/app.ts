import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { SidebarComponent } from './layout/sidebar/sidebar';
import { NavbarComponent } from './layout/navbar/navbar';
import { DashboardApiService } from './services/dashboard-api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    NavbarComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private api: DashboardApiService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log('🚀 App component: Starting SSE connection');
      this.api.startSSE();
    }
  }
}