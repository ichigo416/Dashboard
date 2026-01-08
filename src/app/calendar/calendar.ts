import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
 
type ViewMode = 'month' | 'week' | 'day';

interface CalendarDay {
  date: Date;
  inCurrentMonth: boolean;
}

interface CalendarEvent {
  id: number;
  title: string;
  date: string;      // yyyy-mm-dd
  startHour: number; // 0–23
  endHour: number;   // 1–24
  type: 'meeting' | 'workshop' | 'personal';
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css'
})
export class CalendarComponent {

  viewMode: ViewMode = 'month';
  currentDate = new Date();
  selectedDay: Date = new Date();

  // ===== Modal State =====
  showModal = false;

  // ===== Form Model =====
  newEvent: Partial<CalendarEvent> = {
    title: '',
    type: 'meeting'
  };

  // ===== Events =====
  events: CalendarEvent[] = [
    {
      id: 1,
      title: 'Team Meeting',
      date: this.formatDate(new Date()),
      startHour: 10,
      endHour: 11,
      type: 'meeting'
    }
  ];

  // ===== Helpers =====
  formatDate(d: Date): string {
    return d.toISOString().split('T')[0];
  }

  // ===== Header =====
  get monthLabel(): string {
    return this.currentDate.toLocaleString('default', {
      month: 'long',
      year: 'numeric'
    });
  }

  // ===== Month Grid =====
  get monthDays(): CalendarDay[] {
    const y = this.currentDate.getFullYear();
    const m = this.currentDate.getMonth();
    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);

    const days: CalendarDay[] = [];
    const start = first.getDay();

    for (let i = start - 1; i >= 0; i--) {
      days.push({ date: new Date(y, m, -i), inCurrentMonth: false });
    }

    for (let d = 1; d <= last.getDate(); d++) {
      days.push({ date: new Date(y, m, d), inCurrentMonth: true });
    }

    while (days.length < 42) {
      days.push({ date: new Date(y, m + 1, days.length), inCurrentMonth: false });
    }

    return days;
  }

  // ===== Week =====
  get weekDays(): Date[] {
    const base = new Date(this.currentDate);
    const sunday = new Date(base);
    sunday.setDate(base.getDate() - base.getDay());

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      return d;
    });
  }

  // ===== Day =====
  get hours(): string[] {
    return Array.from({ length: 24 }, (_, i) =>
      i.toString().padStart(2, '0') + ':00'
    );
  }

  // ===== Event Filters =====
  eventsForDate(date: Date): CalendarEvent[] {
    return this.events.filter(e => e.date === this.formatDate(date));
  }

  eventsForHour(date: Date, hour: number): CalendarEvent[] {
    return this.events.filter(
      e =>
        e.date === this.formatDate(date) &&
        hour >= e.startHour &&
        hour < e.endHour
    );
  }

  // ===== Modal Actions =====
  openModal() {
    this.newEvent = {
      title: '',
      date: this.formatDate(this.selectedDay),
      startHour: 9,
      endHour: 10,
      type: 'meeting'
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveEvent() {
    if (!this.newEvent.title || !this.newEvent.date) return;

    this.events.push({
      id: Date.now(),
      title: this.newEvent.title!,
      date: this.newEvent.date!,
      startHour: Number(this.newEvent.startHour),
      endHour: Number(this.newEvent.endHour),
      type: this.newEvent.type as any
    });

    this.closeModal();
  }

  // ===== Navigation =====
  previousMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1
    );
    this.selectedDay = new Date(this.currentDate);
  }

  nextMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1
    );
    this.selectedDay = new Date(this.currentDate);
  }

  setView(mode: ViewMode) {
    this.viewMode = mode;
    if (mode === 'day') {
      this.selectedDay = new Date(this.currentDate);
    }
  }
}
