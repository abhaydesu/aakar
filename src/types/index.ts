export type CredentialStatus = 'Verified' | 'Pending' | 'Verifying' | 'VerificationFailed' | 'Self-Reported';

export type Credential = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  status: CredentialStatus;
  skills: string[];
  group: string | null;
  filePath?: string;
};