import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { SidebarComponent } from './layout/sidebar/sidebar';
import { NavbarComponent } from './layout/navbar/navbar';
import { DashboardApiService } from './services/dashboard-api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, NavbarComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {

  showLayout = false;

  constructor(
    private router: Router,
    private dashboardApi: DashboardApiService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {

    if (isPlatformBrowser(this.platformId)) {

      // 🔴 FORCE LOGIN ON REFRESH (TS SAFE)
      const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];

      if (navEntries.length && navEntries[0].type === 'reload') {
        localStorage.clear();
        this.router.navigate(['/']);
        return;
      }

      // ✅ Start SSE once
      this.dashboardApi.startSSE();
    }

    // 👁️ Control layout visibility
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showLayout = event.url !== '/';
      }
    });
  }
}
