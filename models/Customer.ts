import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted';
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'converted'],
      default: 'new',
    },
    notes: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Customer: Model<ICustomer> = mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);

export default Customer;
