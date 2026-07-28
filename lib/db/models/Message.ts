import mongoose, { Schema, Document } from 'mongoose';

export interface IMessageDocument extends Document {
  id: string;
  restaurantId: string;
  userId: string;
  sender: 'customer' | 'restaurant';
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessageDocument>(
  {
    id: { type: String, required: true, unique: true },
    restaurantId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    sender: { type: String, enum: ['customer', 'restaurant'], required: true },
    text: { type: String, required: true }
  },
  { timestamps: true }
);

MessageSchema.index({ restaurantId: 1, userId: 1, createdAt: 1 });

export const Message = mongoose.models.Message || mongoose.model<IMessageDocument>('Message', MessageSchema);
export default Message;
