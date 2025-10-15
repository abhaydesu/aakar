import { Schema, model, models, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  image?: string;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required!'],
  },
  name: {
    type: String,
    required: [true, 'Name is required!'],
  },
  image: {
    type: String,
  },
});

const User = models.User || model<IUser>('User', UserSchema);

export default User;