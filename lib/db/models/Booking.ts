import mongoose, { Schema, Document } from 'mongoose';

export interface IBookingDocument extends Document {
  id: string;
  userId: string;
  userName: string;
  restaurantId: string;
  restaurantName: string;
  date: string;
  timeSlot: string;
  partySize: number;
  specialRequest?: string;
  status: 'pending' | 'confirmed' | 'declined';
  advancePaid: number;
  tableNumber?: number;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBookingDocument>(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    userName: { type: String, required: true },
    restaurantId: { type: String, required: true, index: true },
    restaurantName: { type: String, required: true },
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    partySize: { type: Number, required: true },
    specialRequest: { type: String },
    status: { 
      type: String, 
      enum: ['pending', 'confirmed', 'declined'], 
      default: 'pending' 
    },
    advancePaid: { type: Number, default: 0 },
    tableNumber: { type: Number }
  },
  { timestamps: true }
);

BookingSchema.index({ restaurantId: 1, date: 1 });

export const Booking = mongoose.models.Booking || mongoose.model<IBookingDocument>('Booking', BookingSchema);
export default Booking;
