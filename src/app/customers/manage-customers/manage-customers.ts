import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerApiService, Customer } from '../../services/customer-api.service';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-manage-customer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './manage-customers.html',
  styleUrls: ['./manage-customer.css']
})
export class ManageCustomerComponent implements OnInit, OnDestroy {
  isBrowser = false;

  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  searchTerm = '';

  // ✅ Counters (ADD ONLY)
  totalUsers = 0;
  activeUsers = 0;
  suspendedUsers = 0;

  // Edit modal
  showEditModal = false;
  editingCustomer: Customer | null = null;

  // Delete confirmation
  showDeleteModal = false;
  deletingCustomerId: string | null = null;

  private subscriptions: Subscription[] = [];

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private customerApi: CustomerApiService,
    private cdr: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    this.customerApi.startCustomerSSE();

    const customerSub = this.customerApi.customers$.subscribe(customers => {
      this.customers = customers;
      this.updateCounts();          // ✅ added
      this.filterCustomers();
      this.cdr.detectChanges();
    });
    this.subscriptions.push(customerSub);

    this.loadCustomers();
  }

  ngOnDestroy(): void {
    this.customerApi.stopCustomerSSE();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadCustomers(): void {
    this.customerApi.getAllCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;
        this.updateCounts();        // ✅ added
        this.filterCustomers();
      },
      error: (error) => {
        console.error('Error loading customers:', error);
      }
    });
  }

  // NEW (safe helper)
  updateCounts(): void {
    this.totalUsers = this.customers.length;
    this.activeUsers = this.customers.filter(c => c.status !== 'SUSPENDED').length;
    this.suspendedUsers = this.customers.filter(c => c.status === 'SUSPENDED').length;
  }

  filterCustomers(): void {
    if (!this.searchTerm) {
      this.filteredCustomers = [...this.customers];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredCustomers = this.customers.filter(customer =>
        customer.firstName.toLowerCase().includes(term) ||
        customer.lastName.toLowerCase().includes(term) ||
        customer.email.toLowerCase().includes(term) ||
        customer.phone.includes(term)
      );
    }
  }

  onSearchChange(): void {
    this.filterCustomers();
  }

  openEditModal(customer: Customer): void {
    this.editingCustomer = { ...customer };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editingCustomer = null;
  }

  saveCustomer(): void {
    if (!this.editingCustomer) return;

    this.customerApi
      .updateCustomer(this.editingCustomer.id, this.editingCustomer)
      .subscribe({
        next: () => {
          this.closeEditModal();
        },
        error: () => {
          alert('Failed to update customer');
        }
      });
  }

  openDeleteModal(customerId: string): void {
    this.deletingCustomerId = customerId;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.deletingCustomerId = null;
  }

  confirmDelete(): void {
    if (!this.deletingCustomerId) return;

    this.customerApi.deleteCustomer(this.deletingCustomerId).subscribe({
      next: () => {
        this.closeDeleteModal();
      },
      error: () => {
        alert('Failed to delete customer');
      }
    });
  }

  // Suspend and unsuspend customer 
toggleCustomerStatus(customer: Customer): void {
  const newStatus =
    customer.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';

  this.customerApi
    .updateCustomerStatus(customer.id, newStatus)
    .subscribe({
      error: () => {
        alert('Failed to update customer status');
      }
    });
} 
} 
