import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDemoRequest extends Document {
  name: string;
  email: string;
  phone: string;
  company: string;
  message?: string;
  status: 'pending' | 'contacted' | 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  contactedBy?: mongoose.Types.ObjectId;
  scheduledDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DemoRequestSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
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
    company: {
      type: String,
      required: [true, 'Company is required'],
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'scheduled', 'completed', 'cancelled'],
      default: 'pending',
    },
    notes: {
      type: String,
      trim: true,
    },
    contactedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    scheduledDate: {
      type: Date,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
    },
  },
  {
    timestamps: true,
  }
);

const DemoRequest: Model<IDemoRequest> = mongoose.models.DemoRequest || mongoose.model<IDemoRequest>('DemoRequest', DemoRequestSchema);

export default DemoRequest;
