import mongoose, { Schema, Document } from 'mongoose';

export interface IExpenseDocument extends Document {
  id: string;
  restaurantId: string;
  itemName: string;
  quantity: string;
  cost: number;
  category: string;
  date: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpenseDocument>(
  {
    id: { type: String, required: true, unique: true },
    restaurantId: { type: String, required: true, index: true },
    itemName: { type: String, required: true },
    quantity: { type: String, required: true },
    cost: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: String, required: true },
    notes: { type: String }
  },
  { timestamps: true }
);

ExpenseSchema.index({ restaurantId: 1, date: -1 });

export const Expense = mongoose.models.Expense || mongoose.model<IExpenseDocument>('Expense', ExpenseSchema);
export default Expense;
