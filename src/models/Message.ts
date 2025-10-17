import { Schema, model, models, Document } from 'mongoose';

export interface IMessage extends Document {
  fromUserId: string;
  toUserId: string;
  text: string;
  roomId?: string;
  createdAt: Date;
  read?: boolean;
}

const MessageSchema = new Schema<IMessage>({
  fromUserId: { type: String, required: true },
  toUserId: { type: String, required: true },
  text: { type: String, required: true },
  roomId: { type: String },
  createdAt: { type: Date, default: () => new Date() },
  read: { type: Boolean, default: false },
});

const Message = models.Message || model<IMessage>('Message', MessageSchema);
export default Message;
