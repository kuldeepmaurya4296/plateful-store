import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '@/lib/types';

export interface IUserDocument extends Document {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  passwordHash?: string;
  role: UserRole;
  avatar: string;
  username: string;
  restaurantId?: string;
  counterId?: string;
  assignedTables?: string[];
  preferences?: {
    dietFilter: 'veg' | 'non-veg' | 'both';
    city: string;
  };
  followedRestaurants?: string[];
  wishlist?: string[];
  bio?: string;
  isActive: boolean;
  isBanned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, sparse: true },
    phone: { type: String, sparse: true },
    passwordHash: { type: String },
    role: { 
      type: String, 
      enum: ['customer', 'owner', 'manager', 'captain', 'superadmin'], 
      required: true 
    },
    avatar: { type: String, default: 'U' },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    restaurantId: { type: String },
    counterId: { type: String },
    assignedTables: [{ type: String }],
    preferences: {
      dietFilter: { type: String, enum: ['veg', 'non-veg', 'both'], default: 'both' },
      city: { type: String, default: 'Mumbai' }
    },
    followedRestaurants: [{ type: String }],
    wishlist: [{ type: String }],
    bio: { type: String },
    isActive: { type: Boolean, default: true },
    isBanned: { type: Boolean, default: false }
  },
  { timestamps: true }
);

UserSchema.index({ role: 1 });
UserSchema.index({ restaurantId: 1 });

export const User = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
export default User;
