import mongoose, { Schema, Document } from 'mongoose';

export interface ILoyaltyDocument extends Document {
  userId: string;
  points: number;
  tier: 'Silver' | 'Gold' | 'Platinum';
  history: Array<{
    id: string;
    type: 'earned' | 'redeemed';
    points: number;
    description: string;
    createdAt: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const LoyaltySchema = new Schema<ILoyaltyDocument>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    points: { type: Number, default: 100 },
    tier: { type: String, enum: ['Silver', 'Gold', 'Platinum'], default: 'Silver' },
    history: [
      {
        id: String,
        type: { type: String, enum: ['earned', 'redeemed'] },
        points: Number,
        description: String,
        createdAt: String
      }
    ]
  },
  { timestamps: true }
);

export const Loyalty = mongoose.models.Loyalty || mongoose.model<ILoyaltyDocument>('Loyalty', LoyaltySchema);
export default Loyalty;
