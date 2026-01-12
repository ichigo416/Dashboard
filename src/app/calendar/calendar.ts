import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type ViewMode = 'month' | 'week' | 'day';

interface CalendarEvent {
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
})
export class CalendarComponent {

  currentDate = new Date();
  viewMode: ViewMode = 'month';

  showAddEvent = false;

  newEvent: CalendarEvent = {
    title: '',
    date: '',
    time: '',
  };

  events: CalendarEvent[] = [];

  /* ---------- NAVIGATION ---------- */

  prev() {
    if (this.viewMode === 'month') {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    } else if (this.viewMode === 'week') {
      this.currentDate.setDate(this.currentDate.getDate() - 7);
    } else {
      this.currentDate.setDate(this.currentDate.getDate() - 1);
    }
    this.currentDate = new Date(this.currentDate);
  }

  next() {
    if (this.viewMode === 'month') {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    } else if (this.viewMode === 'week') {
      this.currentDate.setDate(this.currentDate.getDate() + 7);
    } else {
      this.currentDate.setDate(this.currentDate.getDate() + 1);
    }
    this.currentDate = new Date(this.currentDate);
  }

  setView(mode: ViewMode) {
    this.viewMode = mode;
  }

  /* ---------- ADD EVENT ---------- */

  openAddEvent() {
    this.showAddEvent = true;
    this.newEvent.date = this.currentDate.toISOString().split('T')[0];
  }

  saveEvent() {
    if (!this.newEvent.title || !this.newEvent.date || !this.newEvent.time) {
      alert('Please fill all fields');
      return;
    }

    this.events.push({ ...this.newEvent });
    this.newEvent = { title: '', date: '', time: '' };
    this.showAddEvent = false;
  }

  cancelEvent() {
    this.showAddEvent = false;
  }

  /* ---------- HELPERS ---------- */

  get monthLabel() {
    return this.currentDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  }

  get daysInMonth() {
    const y = this.currentDate.getFullYear();
    const m = this.currentDate.getMonth();
    const lastDay = new Date(y, m + 1, 0).getDate();

    return Array.from({ length: lastDay }, (_, i) =>
      new Date(y, m, i + 1)
    );
  }

  eventsForDay(day: Date) {
    const d = day.toISOString().split('T')[0];
    return this.events.filter(e => e.date === d);
  }

  /* ---------- WEEK / DAY ---------- */

  hours = Array.from({ length: 15 }, (_, i) => i + 6); // 6am–8pm

  getWeekDays() {
    const start = new Date(this.currentDate);
    start.setDate(start.getDate() - start.getDay());

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }

  eventsForDayAndHour(day: Date, hour: number) {
    const d = day.toISOString().split('T')[0];
    return this.events.filter(e => {
      if (e.date !== d) return false;
      return parseInt(e.time.split(':')[0], 10) === hour;
    });
  }
}
