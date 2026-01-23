import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Inject,
  PLATFORM_ID,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { DashboardApiService } from '../../services/dashboard-api.service';
import { Subscription } from 'rxjs';
import { IdleService } from '../../services/idle.service'; // 🔥 ADDED

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('salesChart') salesChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('statsChart') statsChart!: ElementRef<HTMLCanvasElement>;

  private salesChartInstance!: Chart;
  private statsChartInstance!: Chart;
  private subscriptions: Subscription[] = [];

  isBrowser = false;

  // Dashboard data - default values until SSE updates them
  summary = {
    customers: { count: 3782, changePercent: 11.01 },
    orders: { count: 5359, changePercent: -9.05 }
  };

  monthlySalesData: number[] = [];

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private api: DashboardApiService,
    private cdr: ChangeDetectorRef,
    private idleService: IdleService // 🔥 ADDED
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    console.log('🎯 Dashboard component initialized');

    // 🔥 START IDLE SESSION WATCH
    this.idleService.startWatching();

    // 🔍 DEBUG: check SSE status
    console.log('📡 SSE connected:', this.api.isSSEConnected());

    // 📡 Subscribe to summary updates
    const summarySub = this.api.summary$.subscribe(data => {
      if (data) {
        console.log('📊 Summary received:', data);

        this.summary = {
          customers: {
            count: data.customers?.count || 0,
            changePercent: Number((data.customers?.changePercent || 0).toFixed(2))
          },
          orders: {
            count: data.orders?.count || 0,
            changePercent: Number((data.orders?.changePercent || 0).toFixed(2))
          }
        };

        console.log('✅ Summary updated on screen:', this.summary);
        this.cdr.detectChanges();
      }
    });
    this.subscriptions.push(summarySub);

    // 📡 Subscribe to monthly sales updates
    const salesSub = this.api.monthlySales$.subscribe(data => {
      if (data && Array.isArray(data)) {
        console.log('📊 Monthly sales received:', data);

        if (data.length > 0 && typeof data[0] === 'object' && 'value' in data[0]) {
          this.monthlySalesData = data.map((item: any) => item.value);
        } else if (data.length > 0 && typeof data[0] === 'number') {
          this.monthlySalesData = data;
        }

        if (this.salesChartInstance && this.monthlySalesData.length > 0) {
          this.updateSalesChart();
        }

        this.cdr.detectChanges();
      }
    });
    this.subscriptions.push(salesSub);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    setTimeout(() => {
      this.renderMonthlySales();
      this.renderStatistics();
    }, 100);
  }

  ngOnDestroy(): void {
    console.log('🗑️ Dashboard component destroyed');
    this.subscriptions.forEach(sub => sub.unsubscribe());

    if (this.salesChartInstance) {
      this.salesChartInstance.destroy();
    }
    if (this.statsChartInstance) {
      this.statsChartInstance.destroy();
    }
  }

  private renderMonthlySales(): void {
    const chartData = this.monthlySalesData.length > 0
      ? this.monthlySalesData
      : [150, 380, 190, 280, 170, 180, 270, 100, 200, 380, 260, 100];

    this.salesChartInstance = new Chart(this.salesChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        datasets: [{
          data: chartData,
          backgroundColor: '#6366f1',
          borderRadius: 10,
          barThickness: 20
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
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

  private updateSalesChart(): void {
    if (this.salesChartInstance && this.monthlySalesData.length > 0) {
      this.salesChartInstance.data.datasets[0].data = this.monthlySalesData;
      this.salesChartInstance.update('none');
    }
  }

  private renderStatistics(): void {
    this.statsChartInstance = new Chart(this.statsChart.nativeElement, {
      type: 'line',
      data: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        datasets: [
          {
            data: [180,190,170,160,175,165,170,200,225,210,240,235],
            borderColor: '#4f46e5',
            backgroundColor: 'rgba(79,70,229,0.12)',
            fill: true,
            tension: 0.45,
            pointRadius: 0
          },
          {
            data: [40,30,50,40,55,40,70,100,110,120,150,140],
            borderColor: '#93c5fd',
            backgroundColor: 'rgba(147,197,253,0.25)',
            fill: true,
            tension: 0.45,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
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
