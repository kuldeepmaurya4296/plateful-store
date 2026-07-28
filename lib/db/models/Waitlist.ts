import mongoose, { Schema, Document } from 'mongoose';

export interface IWaitlistDocument extends Document {
  id: string;
  restaurantId: string;
  userId: string;
  userName: string;
  userPhone: string;
  partySize: number;
  status: 'waiting' | 'notified' | 'seated' | 'cancelled';
  position: number;
  estimatedWaitMinutes: number;
  createdAt: Date;
  updatedAt: Date;
}

const WaitlistSchema = new Schema<IWaitlistDocument>(
  {
    id: { type: String, required: true, unique: true },
    restaurantId: { type: String, required: true, index: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userPhone: { type: String, required: true },
    partySize: { type: Number, required: true, default: 2 },
    status: {
      type: String,
      enum: ['waiting', 'notified', 'seated', 'cancelled'],
      default: 'waiting'
    },
    position: { type: Number, default: 1 },
    estimatedWaitMinutes: { type: Number, default: 15 }
  },
  { timestamps: true }
);

export const Waitlist = mongoose.models.Waitlist || mongoose.model<IWaitlistDocument>('Waitlist', WaitlistSchema);
export default Waitlist;
