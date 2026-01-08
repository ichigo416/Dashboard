import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './line-chart.html',
  styleUrl: './line-chart.css',
})
export class LineChartComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    const ctx = document.getElementById('lineChart') as HTMLCanvasElement;

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ],
        datasets: [
          {
            label: 'Revenue',
            data: [180, 190, 170, 160, 175, 165, 170, 205, 230, 210, 240, 235],
            borderColor: '#4f5dff',
            backgroundColor: 'rgba(79,93,255,0.15)',
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 5,
          },
          {
            label: 'Sales',
            data: [40, 30, 50, 40, 55, 40, 70, 100, 110, 120, 150, 140],
            borderColor: '#9bbcff',
            backgroundColor: 'rgba(155,188,255,0.2)',
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,

        interaction: {
          mode: 'nearest',
          intersect: false,
        },

        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
            backgroundColor: '#ffffff',
            titleColor: '#111827',
            bodyColor: '#111827',
            borderColor: '#e5e7eb',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || '';
                const value = context.parsed.y;
                return `${label}: ${value}`;
              },
            },
          },
        },

        scales: {
          x: {
            grid: { display: false },
          },
          y: {
            grid: { color: '#f1f5f9' },
          },
        },
      },
    });
  }
}
