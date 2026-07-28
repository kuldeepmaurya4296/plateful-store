import mongoose, { Schema, Document } from 'mongoose';

export interface IVisitDocument extends Document {
  id: string;
  userId: string;
  restaurantId: string;
  tableId: string;
  paymentConfirmedAt: string;
  reviewWindowOpensAt: string;
  reviewWindowClosesAt: string;
  isReviewed: boolean;
  billId: string;
  createdAt: Date;
  updatedAt: Date;
}

const VisitSchema = new Schema<IVisitDocument>(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    restaurantId: { type: String, required: true, index: true },
    tableId: { type: String, required: true },
    paymentConfirmedAt: { type: String, required: true },
    reviewWindowOpensAt: { type: String, required: true },
    reviewWindowClosesAt: { type: String, required: true },
    isReviewed: { type: Boolean, default: false },
    billId: { type: String, required: true }
  },
  { timestamps: true }
);

VisitSchema.index({ userId: 1, isReviewed: 1 });

export const Visit = mongoose.models.Visit || mongoose.model<IVisitDocument>('Visit', VisitSchema);
export default Visit;
