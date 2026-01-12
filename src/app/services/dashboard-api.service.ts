import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardApiService {

  // Backend base URL
  private baseUrl = 'http://localhost:3000/api/dashboard';

  constructor(private http: HttpClient) {}

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

  // GET target (FIXED TYPE)
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
}
