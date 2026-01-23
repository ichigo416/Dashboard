import mongoose, { Schema, Document } from "mongoose";

export interface CustomerDocument extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  dateOfBirth: string;

  status: 'ACTIVE' | 'SUSPENDED';

  createdAt: string;
  updatedAt: string;
}

const CustomerSchema = new Schema<CustomerDocument>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    dateOfBirth: { type: String, required: true },

    status: {
      type: String,
      enum: ['ACTIVE', 'SUSPENDED'],
      default: 'ACTIVE'
    }
  },
  {
    timestamps: true
  }
);

export const CustomerModel = mongoose.model<CustomerDocument>(
  "Customer",
  CustomerSchema
);