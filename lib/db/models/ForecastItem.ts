import mongoose, { Schema, Document } from 'mongoose';

export interface IForecastItemDocument extends Document {
  id: string;
  restaurantId: string;
  itemName: string;
  quantityNeeded: string;
  estimatedCost: number;
  isPurchased: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ForecastItemSchema = new Schema<IForecastItemDocument>(
  {
    id: { type: String, required: true, unique: true },
    restaurantId: { type: String, required: true, index: true },
    itemName: { type: String, required: true },
    quantityNeeded: { type: String, required: true },
    estimatedCost: { type: Number, required: true },
    isPurchased: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const ForecastItem = mongoose.models.ForecastItem || mongoose.model<IForecastItemDocument>('ForecastItem', ForecastItemSchema);
export default ForecastItem;
