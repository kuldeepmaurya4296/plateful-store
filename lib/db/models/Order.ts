import mongoose, { Schema, Document } from 'mongoose';
import { OrderItem } from '@/lib/types';

export interface IOrderDocument extends Document {
  id: string;
  restaurantId: string;
  type: 'online' | 'dine-in';
  tableId?: string;
  tableNumber?: number;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  customerName: string;
  customerPhone: string;
  deliveryAddress?: string;
}

const OrderSchema = new Schema<IOrderDocument>(
  {
    id: { type: String, required: true, unique: true },
    restaurantId: { type: String, required: true, index: true },
    type: { type: String, enum: ['online', 'dine-in'], required: true },
    tableId: { type: String },
    tableNumber: { type: Number },
    items: [{
      menuItemId: String,
      name: String,
      quantity: Number,
      price: Number
    }],
    total: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'preparing', 'ready', 'delivered', 'completed', 'cancelled'], 
      default: 'pending' 
    },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    deliveryAddress: { type: String }
  },
  { timestamps: true }
);

OrderSchema.index({ restaurantId: 1, createdAt: -1 });

export const Order = mongoose.models.Order || mongoose.model<IOrderDocument>('Order', OrderSchema);
export default Order;
