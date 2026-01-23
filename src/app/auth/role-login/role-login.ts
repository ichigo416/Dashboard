import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-role-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './role-login.html',
  styleUrls: ['./role-login.css']
})
export class RoleLoginComponent implements OnInit {

  selectedRole: 'admin' | 'customer' | null = null;
  email = '';
  password = '';
  showPassword = false;
  rememberMe = false;
  loading = false;
  errorMessage = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  selectRole(role: 'admin' | 'customer') {
    this.selectedRole = role;
    this.errorMessage = '';
    this.email = '';
    this.password = '';
  }

  goBack() {
    this.selectedRole = null;
    this.email = '';
    this.password = '';
    this.errorMessage = '';
    this.showPassword = false;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    this.errorMessage = '';

    if (!this.selectedRole) {
      this.errorMessage = 'Please select a role';
      return;
    }

    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.loading = true;
    console.log('🔐 Starting login...', { email: this.email, role: this.selectedRole });

    this.auth.login(this.email, this.password, this.selectedRole).subscribe({
      next: (response) => {
        console.log('✅ Login response:', response);
        
        if (!isPlatformBrowser(this.platformId)) {
          this.loading = false;
          return;
        }

        // ✅ STORE DATA IMMEDIATELY
        if (response.token) {
          localStorage.setItem('token', response.token);
          console.log('✅ Token stored');
        }
        
        if (response.role) {
          localStorage.setItem('role', response.role);
          console.log('✅ Role stored:', response.role);
        }
        
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }

        if (this.rememberMe) {
          localStorage.setItem('rememberedEmail', this.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        // ✅ SMALL DELAY TO ENSURE LOCALSTORAGE IS SET
        setTimeout(() => {
          console.log('🚀 Navigating to dashboard...');
          this.router.navigate(['/dashboard']).then((success) => {
            this.loading = false;
            if (success) {
              console.log('✅ Navigation successful!');
            } else {
              console.error('❌ Navigation blocked!');
              this.errorMessage = 'Navigation was blocked. Please try again.';
            }
          }).catch(err => {
            this.loading = false;
            console.error('❌ Navigation error:', err);
            this.errorMessage = 'Navigation failed. Please try again.';
          });
        }, 100);
      },
      error: (error) => {
        console.error('❌ Login error:', error);
        this.loading = false;

        if (error?.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error?.message) {
          this.errorMessage = error.message;
        } else {
          this.errorMessage = 'Login failed. Please check your credentials.';
        }
      }
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const rememberedEmail = localStorage.getItem('rememberedEmail');
      if (rememberedEmail) {
        this.email = rememberedEmail;
        this.rememberMe = true;
      }
    }
  }
}