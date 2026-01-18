import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrganization extends Document {
  name: string;
  slug: string;
  email: string;
  phone?: string;
  domain?: string;
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'suspended' | 'cancelled';
  subscriptionId?: string;
  billingEmail?: string;
  maxUsers?: number;
  maxProjects?: number;
  ownerId: mongoose.Types.ObjectId;
  settings: {
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
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
      trim: true,
    },
    domain: {
      type: String,
      trim: true,
    },
    plan: {
      type: String,
      enum: ['free', 'starter', 'professional', 'enterprise'],
      default: 'free',
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'cancelled'],
      default: 'active',
    },
    subscriptionId: {
      type: String,
    },
    billingEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    maxUsers: {
      type: Number,
      default: 10,
    },
    maxProjects: {
      type: Number,
      default: 50,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    settings: {
      logo: String,
      primaryColor: String,
      secondaryColor: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
OrganizationSchema.index({ slug: 1 });
OrganizationSchema.index({ ownerId: 1 });

const Organization: Model<IOrganization> = mongoose.models.Organization || mongoose.model<IOrganization>('Organization', OrganizationSchema);

export default Organization;
