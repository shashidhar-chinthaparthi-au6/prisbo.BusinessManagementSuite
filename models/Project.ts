import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description?: string;
  customerId: mongoose.Types.ObjectId;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: Date;
  assignedTo?: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, 'Customer is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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

const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
