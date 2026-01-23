import { CustomerRepo } from "../repos/CustomerRepo";
import { Customer } from "../models/common/Customer";

export class CustomerService {

  static async getAllCustomers(): Promise<Customer[]> {
    return await CustomerRepo.getAll();
  }

  static async getCustomerById(id: string): Promise<Customer | null> {
    return await CustomerRepo.getById(id);
  }

  static async addCustomer(
    customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Customer> {
    // Ensure default status is ACTIVE (non-breaking)
    return await CustomerRepo.create({
      ...customerData,
      status: customerData.status ?? "ACTIVE"
    });
  }

  static async updateCustomer(
    id: string,
    updates: Partial<Omit<Customer, 'id' | 'createdAt'>>
  ): Promise<Customer | null> {
    return await CustomerRepo.update(id, updates);
  }

  static async updateCustomerStatus(
  id: string,
  status: "ACTIVE" | "SUSPENDED"
): Promise<Customer | null> {
  return await CustomerRepo.updateStatus(id, status);
}


  static async deleteCustomer(id: string): Promise<boolean> {
    return await CustomerRepo.delete(id);
  }

  // ✅ NEW: Suspend customer (isolated, safe)
  static async suspendCustomer(id: string): Promise<Customer | null> {
    return await CustomerRepo.suspendById(id);
  }
}
