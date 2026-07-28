import mongoose, { Schema, Document } from 'mongoose';
import { OrderItem } from '@/lib/types';

export interface IBillDocument extends Document {
  id: string;
  tableNumber?: number;
  restaurantId: string;
  customerName: string;
  customerPhone: string;
  paymentMode: string;
  total: number;
  tax: number;
  discount: number;
  grandTotal: number;
  startedBy: string;
  settledBy: string;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
  slipPhoto?: string;
}

const BillSchema = new Schema<IBillDocument>(
  {
    id: { type: String, required: true, unique: true },
    tableNumber: { type: Number },
    restaurantId: { type: String, required: true, index: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    paymentMode: { type: String, required: true },
    total: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    startedBy: { type: String, required: true },
    settledBy: { type: String, required: true },
    items: [{
      name: String,
      quantity: Number,
      price: Number
    }],
    slipPhoto: { type: String }
  },
  { timestamps: true }
);

BillSchema.index({ restaurantId: 1, createdAt: -1 });

export const Bill = mongoose.models.Bill || mongoose.model<IBillDocument>('Bill', BillSchema);
export default Bill;
