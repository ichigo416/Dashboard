import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class IdleService {

  private timeout: any;
  private readonly IDLE_TIME = 60000; // 1 minute

  constructor(private router: Router, private ngZone: NgZone) {}

  startWatching() {
    console.log('🟢 IdleService started');
    this.resetTimer();
    this.initListeners();
  }

  // 🔥 THIS METHOD WAS MISSING OR WRONG
  private initListeners() {
    document.addEventListener('click', () => this.resetTimer());
    document.addEventListener('keydown', () => this.resetTimer());
    document.addEventListener('mousemove', () => this.resetTimer());
  }

  private resetTimer() {
    console.log('🔁 Resetting idle timer');
    clearTimeout(this.timeout);
    this.ngZone.runOutsideAngular(() => {
      this.timeout = setTimeout(() => {
        console.log('⏰ IDLE TIMEOUT REACHED');
        this.ngZone.run(() => this.logout());
      }, this.IDLE_TIME);
    });
  }

  private logout() {
  console.log('🚨 Logging out due to inactivity');
  localStorage.clear();
  this.router.navigateByUrl('/'); // ✅ Redirect to RoleLoginComponent
}
} 