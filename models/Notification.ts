import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info',
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    link: {
      type: String,
    },
    read: {
      type: Boolean,
      default: false,
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

// Index for efficient queries
NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

const Notification: Model<INotification> = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
