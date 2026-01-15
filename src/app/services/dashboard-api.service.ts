import { Injectable, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardApiService {

  // Backend base URL
  private baseUrl = 'http://localhost:3000/api/dashboard';

  // 🔁 Shared state for live dashboard data
  private summarySubject = new BehaviorSubject<any>(null);
  summary$ = this.summarySubject.asObservable();

  private monthlySalesSubject = new BehaviorSubject<any>(null);
  monthlySales$ = this.monthlySalesSubject.asObservable();

  private targetSubject = new BehaviorSubject<any>(null);
  target$ = this.targetSubject.asObservable();

  private eventSource: EventSource | null = null;
  private isConnected = false;
  private isBrowser = false;

  constructor(
    private http: HttpClient,
    private zone: NgZone,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /* -----------------------------
     NORMAL REST APIs (UNCHANGED)
  ------------------------------*/

  // GET summary
  getSummary(): Observable<any> {
    return this.http.get(`${this.baseUrl}/summary`);
  }

  // GET monthly sales
  getMonthlySales(): Observable<number[]> {
    return this.http.get<any[]>(`${this.baseUrl}/monthly-sales`).pipe(
      map(items => items.map(item => item.value))
    );
  }

  // GET target
  getTarget(): Observable<{
    targetPercent: number;
    todayRevenue: number;
    comparison: string;
  }> {
    return this.http.get<{
      targetPercent: number;
      todayRevenue: number;
      comparison: string;
    }>(`${this.baseUrl}/target`);
  }

  // GET statistics
  getStatistics(
    type: 'monthly' | 'quarterly' | 'annually'
  ): Observable<number[]> {
    return this.http.get<number[]>(
      `${this.baseUrl}/statistics/${type}`
    );
  }

  // POST update dashboard
  updateDashboard(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, data);
  }

  /* -----------------------------
     🔵 SERVER-SENT EVENTS (SSE)
  ------------------------------*/

  startSSE(): void {
    // Only work in browser
    if (!this.isBrowser) {
      console.log('⏭️ SSE: Not in browser, skipping');
      return;
    }

    // Prevent multiple connections
    if (this.isConnected || this.eventSource) {
      console.log('⚠️ SSE already connected, skipping...');
      return;
    }

    console.log('🔵 Starting SSE connection...');
    this.isConnected = true;

    // Create SSE connection
    this.eventSource = new EventSource(`${this.baseUrl}/stream`);

    // Handle incoming messages
    this.eventSource.onmessage = (event) => {
      this.zone.run(() => {
        try {
          const data = JSON.parse(event.data);
          console.log('📩 SSE data received:', data);

          // Update all subjects with new data
          if (data.summary) {
            this.summarySubject.next(data.summary);
          }
          if (data.monthlySales) {
            this.monthlySalesSubject.next(data.monthlySales);
          }
          if (data.target) {
            this.targetSubject.next(data.target);
          }
        } catch (error) {
          console.error('Error parsing SSE data:', error);
        }
      });
    };

    // Handle connection open
    this.eventSource.onopen = () => {
      console.log('✅ SSE connection established');
    };

    // Handle errors
    this.eventSource.onerror = (error) => {
      console.error('❌ SSE error:', error);
      this.zone.run(() => {
        this.isConnected = false;
        if (this.eventSource) {
          this.eventSource.close();
          this.eventSource = null;
        }
        
        // Attempt to reconnect after 5 seconds
        console.log('🔄 Will attempt to reconnect in 5 seconds...');
        setTimeout(() => this.startSSE(), 5000);
      });
    };
  }

  // Stop SSE connection
  stopSSE(): void {
    if (this.eventSource) {
      console.log('🛑 Closing SSE connection');
      this.eventSource.close();
      this.eventSource = null;
      this.isConnected = false;
    }
  }

  // Check if connected
  isSSEConnected(): boolean {
    return this.isConnected;
  }
}