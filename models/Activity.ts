import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IActivity extends Document {
  type: 'customer' | 'project' | 'team';
  action: string;
  description: string;
  userId: mongoose.Types.ObjectId;
  relatedId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const ActivitySchema: Schema = new Schema(
  {
    type: {
      type: String,
      enum: ['customer', 'project', 'team'],
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    relatedId: {
      type: Schema.Types.ObjectId,
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

const Activity: Model<IActivity> = mongoose.models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema);

export default Activity;
