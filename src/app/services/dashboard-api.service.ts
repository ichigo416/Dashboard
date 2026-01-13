import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardApiService {

  // Backend base URL
  private baseUrl = 'http://localhost:3000/api/dashboard';

  // 🔁 Shared state for live summary
  private summarySubject = new BehaviorSubject<any>(null);
  summary$ = this.summarySubject.asObservable();

  private pollingIntervalId: any;

  constructor(
    private http: HttpClient,
    private zone: NgZone
  ) {}

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
     🟡 POLLING (AUTO REFRESH)
  ------------------------------*/

  startPolling(intervalMs: number = 5000): void {
    // Initial fetch
    this.getSummary().subscribe(data => {
      this.summarySubject.next(data);
    });

    // Repeated polling
    this.pollingIntervalId = setInterval(() => {
      this.getSummary().subscribe(data => {
        this.summarySubject.next(data);
      });
    }, intervalMs);
  }

  stopPolling(): void {
    if (this.pollingIntervalId) {
      clearInterval(this.pollingIntervalId);
    }
  }

  /* -----------------------------
     🔵 SERVER-SENT EVENTS (SSE)
  ------------------------------*/

 startSSE(): void {

  // 1️⃣ Send initial value using REST (important)
  this.getSummary().subscribe(data => {
    this.summarySubject.next(data);
  });

  // 2️⃣ Start SSE stream
  const eventSource = new EventSource(`${this.baseUrl}/stream`);

  eventSource.onmessage = (event) => {
    this.zone.run(() => {
      this.summarySubject.next(JSON.parse(event.data));
    });
  };

  eventSource.onerror = (error) => {
    console.error('SSE error', error);
    eventSource.close();
  };
  } 
}
