import mongoose, { Schema, Document } from 'mongoose';

export interface IMenuItemDocument extends Document {
  id: string;
  restaurantId: string;
  name: string;
  price: number;
  category: string;
  isVeg: boolean;
  isAvailable: boolean;
  description: string;
  presentationNote?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema = new Schema<IMenuItemDocument>(
  {
    id: { type: String, required: true, unique: true },
    restaurantId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    isVeg: { type: Boolean, default: true },
    isAvailable: { type: Boolean, default: true },
    description: { type: String, default: '' },
    presentationNote: { type: String },
    image: { type: String }
  },
  { timestamps: true }
);

MenuItemSchema.index({ restaurantId: 1, category: 1 });

export const MenuItem = mongoose.models.MenuItem || mongoose.model<IMenuItemDocument>('MenuItem', MenuItemSchema);
export default MenuItem;
