import { Schema, model, models, Document, Types } from 'mongoose';
import { CredentialStatus } from '@/types';

export interface ICredential extends Document {
  userId: Types.ObjectId;
  title: string;
  issuer: string;
  status: CredentialStatus;
  date: Date;
  skills: string[];
  group?: string | null;
  // Change from filePath to these two fields
  fileData?: string; // Will store the Base64 encoded file
  fileMimeType?: string; // Will store the file's MIME type (e.g., 'application/pdf')
}

const CredentialSchema = new Schema<ICredential>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: [true, 'Title is required.'] },
  issuer: { type: String, required: [true, 'Issuer is required.'] },
  status: {
    type: String,
    enum: ['Verified', 'Pending', 'Verifying', 'VerificationFailed', 'Self-Reported'],
    default: 'Verifying',
  },
  date: { type: Date, required: [true, 'Date is required.'] },
  skills: { type: [String], default: [] },
  group: { type: String, default: null },
  // Add the new fields to the schema
  fileData: { type: String },
  fileMimeType: { type: String },
}, { timestamps: true });

const Credential = models.Credential || model<ICredential>('Credential', CredentialSchema);

export default Credential;