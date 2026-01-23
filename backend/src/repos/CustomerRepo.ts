import { Customer } from "../models/common/Customer";
import { CustomerModel } from "../models/CustomerModel";

export class CustomerRepo {

  static async getAll(): Promise<Customer[]> {
    const customers = await CustomerModel.find().lean();
    return customers.map(this.mapToCustomer);
  }

  static async getById(id: string): Promise<Customer | null> {
    const customer = await CustomerModel.findById(id).lean();
    return customer ? this.mapToCustomer(customer) : null;
  }

  static async create(
    customer: Omit<Customer, "id" | "createdAt" | "updatedAt">
  ): Promise<Customer> {
    const created = await CustomerModel.create(customer);
    return this.mapToCustomer(created.toObject());
  }

  static async update(
    id: string,
    updates: Partial<Omit<Customer, "id" | "createdAt">>
  ): Promise<Customer | null> {
    const updated = await CustomerModel.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    ).lean();

    return updated ? this.mapToCustomer(updated) : null;
  }

  static async delete(id: string): Promise<boolean> {
    const result = await CustomerModel.findByIdAndDelete(id);
    return !!result;
  }

  
  static async suspendById(id: string): Promise<Customer | null> {
    const updated = await CustomerModel.findByIdAndUpdate(
      id,
      { status: "SUSPENDED" },
      { new: true }
    ).lean();

    return updated ? this.mapToCustomer(updated) : null;
  } 

  static async updateStatus(
  id: string,
  status: "ACTIVE" | "SUSPENDED"
): Promise<Customer | null> {
  const updated = await CustomerModel.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  ).lean();

  return updated ? this.mapToCustomer(updated) : null;
}


  // 🔁 Map Mongo _id → id (VERY IMPORTANT)
  private static mapToCustomer(doc: any): Customer {
    return {
      id: doc._id.toString(),
      firstName: doc.firstName,
      lastName: doc.lastName,
      email: doc.email,
      phone: doc.phone,
      address: doc.address,
      city: doc.city,
      country: doc.country,
      dateOfBirth: doc.dateOfBirth,
      status: doc.status ?? "ACTIVE",
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }
}
