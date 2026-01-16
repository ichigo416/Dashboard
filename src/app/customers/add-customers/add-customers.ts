import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerApiService } from '../../services/customer-api.service'; 
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-add-customer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-customers.html',
  styleUrls: ['./add-customers.css']
})
export class AddCustomerComponent {
  isBrowser = false;

  customer = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    dateOfBirth: ''
  };

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private customerApi: CustomerApiService,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  onSubmit(): void {
    if (!this.isBrowser) return;

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.customerApi.addCustomer(this.customer).subscribe({
      next: (response) => {
        console.log('✅ Customer added:', response);
        this.successMessage = 'Customer added successfully!';
        this.isSubmitting = false;
        
        // Reset form
        this.customer = {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          country: '',
          dateOfBirth: ''
        };

        // Redirect after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/customers/manage']);
        }, 2000);
      },
      error: (error) => {
        console.error('❌ Error adding customer:', error);
        this.errorMessage = 'Failed to add customer. Please try again.';
        this.isSubmitting = false;
      }
    });
  }
}