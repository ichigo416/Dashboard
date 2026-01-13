import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Inject,
  PLATFORM_ID,
  OnInit,
  OnDestroy
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { DashboardApiService } from '../../services/dashboard-api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent
  implements OnInit, AfterViewInit, OnDestroy {

  // ===== BAR CHART =====
  @ViewChild('salesChart') salesChart!: ElementRef<HTMLCanvasElement>;
  private salesBarChart: Chart | null = null;

  // ===== LINE CHART =====
  @ViewChild('statsChart') statsChart!: ElementRef<HTMLCanvasElement>;
  private statsLineChart: Chart | null = null;

  private isBrowser = false;

  // ===== BACKEND DATA =====
  monthlySales: number[] = [];
  statsSales: number[] = [];
  statsRevenue: number[] = [];

  // 🔴 LIVE SUMMARY (Polling / SSE)
  summary: any;
  private summarySub!: Subscription;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private dashboardApi: DashboardApiService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  // ================= ON INIT =================
  ngOnInit(): void {
    if (!this.isBrowser) return;

    // 🔵 START SERVER-SENT EVENTS (RECOMMENDED)
   this.dashboardApi.startSSE();

this.summarySub = this.dashboardApi.summary$.subscribe(data => {
  this.summary = data;
});


    // 🟡 OR use polling instead
    // this.dashboardApi.startPolling(5000);

    // Subscribe to live summary
    this.summarySub = this.dashboardApi.summary$.subscribe(data => {
      this.summary = data;
      console.log('LIVE SUMMARY:', data);
    });
  }

  // ================= AFTER VIEW =================
  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.loadDashboardData();
  }

  // ================= CLEANUP =================
  ngOnDestroy(): void {
    this.summarySub?.unsubscribe();
  }

  // ================= LOAD BACKEND DATA =================
  private loadDashboardData(): void {

    // ===== BAR CHART DATA (ONE-TIME LOAD) =====
    this.dashboardApi.getMonthlySales().subscribe(data => {
      this.monthlySales = data;
      this.renderSalesChart();
    });

    // ===== LINE CHART DATA (ONE-TIME LOAD) =====
    this.dashboardApi.getStatistics('monthly').subscribe(data => {
      this.statsSales = data;
      this.statsRevenue = data.map(v => Math.round(v * 0.25));
      this.renderStatsChart();
    });
  }

  // ================= BAR CHART =================
  private renderSalesChart(): void {
    if (!this.salesChart) return;

    this.salesBarChart?.destroy();

    this.salesBarChart = new Chart(this.salesChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        datasets: [{
          data: this.monthlySales.length
            ? this.monthlySales
            : [150, 380, 190, 280, 170, 180, 270, 100, 200, 380, 260, 100],
          backgroundColor: '#6366f1',
          borderRadius: 10,
          barThickness: 26
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, border: { display: false } },
          y: {
            beginAtZero: true,
            max: 400,
            ticks: { stepSize: 100 },
            grid: { color: '#eef2f7' },
            border: { display: false }
          }
        }
      }
    });
  }

  // ================= LINE CHART =================
  private renderStatsChart(): void {
    if (!this.statsChart) return;

    this.statsLineChart?.destroy();

    this.statsLineChart = new Chart(this.statsChart.nativeElement, {
      type: 'line',
      data: {
        labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Sales',
            data: this.statsSales.length
              ? this.statsSales
              : [190, 170, 160, 175, 165],
            borderColor: '#4f46e5',
            backgroundColor: 'rgba(79,70,229,0.15)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6
          },
          {
            label: 'Revenue',
            data: this.statsRevenue.length
              ? this.statsRevenue
              : [30, 50, 40, 55, 40],
            borderColor: '#93c5fd',
            backgroundColor: 'rgba(147,197,253,0.2)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'nearest',
          intersect: false
        },
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { grid: { display: false }, border: { display: false } },
          y: {
            beginAtZero: true,
            grid: { color: '#eef2f7' },
            border: { display: false }
          }
        }
      }
    });
  }
}
