import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements AfterViewInit {

  // ===== BAR CHART =====
  @ViewChild('salesChart') salesChart!: ElementRef<HTMLCanvasElement>;
  private salesBarChart: Chart | null = null;

  // ===== LINE CHART =====
  @ViewChild('statsChart') statsChart!: ElementRef<HTMLCanvasElement>;
  private statsLineChart: Chart | null = null;

  private isBrowser = false;
hideTooltip: any;
showTooltip: any;
tooltip: any;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    setTimeout(() => {
      this.renderSalesChart();
      this.renderStatsChart();
    }, 0);
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
          data: [150, 380, 190, 280, 170, 180, 270, 100, 200, 380, 260, 100],
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

  // ================= LINE CHART (STATISTICS) =================
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
            data: [190, 170, 160, 175, 165],
            borderColor: '#4f46e5',
            backgroundColor: 'rgba(79,70,229,0.15)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6
          },
          {
            label: 'Revenue',
            data: [30, 50, 40, 55, 40],
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

        // 🔥 THIS ENABLES CLICK + HOVER TOOLTIP
        interaction: {
          mode: 'nearest',
          intersect: false
        },

        plugins: {
          legend: { display: false },

          tooltip: {
            enabled: true,
            backgroundColor: '#ffffff',
            titleColor: '#111827',
            bodyColor: '#111827',
            borderColor: '#e5e7eb',
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            callbacks: {
              title: (items) => items[0].label,
              label: (item) => `${item.dataset.label}: ${item.formattedValue}`
            }
          }
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


