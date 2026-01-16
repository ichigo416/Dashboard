import { Injectable, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  dateOfBirth: string;
  status?: 'ACTIVE' | 'SUSPENDED'; // ✅ added (non-breaking)
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerApiService {
  private baseUrl = 'http://localhost:3000/api/customers';

  private customersSubject = new BehaviorSubject<Customer[]>([]);
  customers$ = this.customersSubject.asObservable();

  private eventSource: EventSource | null = null;
  private isBrowser = false;

  constructor(
    private http: HttpClient,
    private zone: NgZone,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  getAllCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.baseUrl);
  }

  getCustomerById(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/${id}`);
  }

  addCustomer(
    customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>
  ): Observable<Customer> {
    return this.http.post<Customer>(this.baseUrl, customer);
  }

  updateCustomer(
    id: string,
    customer: Partial<Customer>
  ): Observable<Customer> {
    return this.http.put<Customer>(`${this.baseUrl}/${id}`, customer);
  }

  deleteCustomer(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // ✅ NEW: suspend customer
  suspendCustomer(id: string): Observable<Customer> {
    return this.http.patch<Customer>(`${this.baseUrl}/${id}/suspend`, {});
  }

  startCustomerSSE(): void {
    if (!this.isBrowser || this.eventSource) return;

    this.eventSource = new EventSource(`${this.baseUrl}/sse/stream`);

    this.eventSource.addEventListener('customer-update', (event: any) => {
      this.zone.run(() => {
        const data = JSON.parse(event.data);

        if (data.type === 'initial') {
          this.customersSubject.next(data.customers);
        } else {
          this.getAllCustomers().subscribe(customers => {
            this.customersSubject.next(customers);
          });
        }
      });
    });
  }

  updateCustomerStatus(
  id: string,
  status: "ACTIVE" | "SUSPENDED"
) {
  return this.http.patch<Customer>(
    `${this.baseUrl}/${id}/status`,
    { status }
  );
}

  stopCustomerSSE(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}