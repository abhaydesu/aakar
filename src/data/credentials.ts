import mongoose, { Schema, Document, Model } from 'mongoose';
import { CredentialStatus } from '@/types';

export interface ICredential extends Document {
  title: string;
  issuer: string;
  date: string;
  status: CredentialStatus;
  skills: string[];
  group: string | null;
  filePath?: string;
}

const CredentialSchema: Schema<ICredential> = new Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: String, required: true },
  status: { 
    type: String, 
    required: true,
    // FIX: Added 'Verifying' and 'VerificationFailed' to the list of allowed values.
    enum: ['Verified', 'Pending', 'Verifying', 'VerificationFailed', 'Self-Reported'],
  },
  skills: { type: [String], required: true },
  group: { type: String, default: null },
  filePath: { type: String },
});

const CredentialModel: Model<ICredential> = mongoose.models.Credential || mongoose.model<ICredential>('Credential', CredentialSchema);

export default CredentialModel;