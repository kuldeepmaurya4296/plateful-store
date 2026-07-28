import mongoose, { Schema, Document } from 'mongoose';

export interface ICounterDocument extends Document {
  id: string;
  name: string;
  restaurantId: string;
  tableRange: string;
  captainId: string;
  captainName: string;
  createdAt: Date;
  updatedAt: Date;
}

const CounterSchema = new Schema<ICounterDocument>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    restaurantId: { type: String, required: true, index: true },
    tableRange: { type: String, required: true },
    captainId: { type: String, required: true },
    captainName: { type: String, required: true }
  },
  { timestamps: true }
);

export const Counter = mongoose.models.Counter || mongoose.model<ICounterDocument>('Counter', CounterSchema);
export default Counter;
