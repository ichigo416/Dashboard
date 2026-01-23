import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {

    // 🚫 Block access on server (SSR)
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    const allowedRoles: string[] = route.data['roles'] || [];
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    console.log('🔒 RoleGuard Check:', { token: !!token, role, allowedRoles });

    // ❌ Not logged in at all
    if (!token || !role) {
      console.log('❌ No token or role - redirecting to login');
      this.router.navigate(['/']);
      return false;
    }

    // ✅ Check if role is allowed
    if (allowedRoles.includes(role)) {
      console.log('✅ Access granted');
      return true;
    }

    // ❌ Role not allowed
    console.log('❌ Role not allowed - redirecting to login');
    this.router.navigate(['/']);
    return false;
  }
}