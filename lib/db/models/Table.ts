import mongoose, { Schema, Document } from 'mongoose';
import { TableStatus, OrderItem } from '@/lib/types';

export interface IActiveSession {
  customerName: string;
  customerPhone: string;
  startedBy: string;
  startedAt: string;
  items: OrderItem[];
  total: number;
  preparationNote?: string;
}

export interface ITableDocument extends Document {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  counterId: string;
  restaurantId: string;
  qrToken: string;
  activeSession: IActiveSession | null;
  createdAt: Date;
  updatedAt: Date;
}

const TableSchema = new Schema<ITableDocument>(
  {
    id: { type: String, required: true, unique: true },
    number: { type: Number, required: true },
    capacity: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['available', 'occupied', 'billing', 'settling'], 
      default: 'available' 
    },
    counterId: { type: String, required: true },
    restaurantId: { type: String, required: true, index: true },
    qrToken: { type: String, required: true, unique: true },
    activeSession: {
      type: {
        customerName: { type: String },
        customerPhone: { type: String },
        startedBy: { type: String },
        startedAt: { type: String },
        items: [{
          menuItemId: String,
          name: String,
          quantity: Number,
          price: Number
        }],
        total: { type: Number, default: 0 },
        preparationNote: String
      },
      default: null
    }
  },
  { timestamps: true }
);

TableSchema.index({ restaurantId: 1, number: 1 });

export const Table = mongoose.models.Table || mongoose.model<ITableDocument>('Table', TableSchema);
export default Table;
