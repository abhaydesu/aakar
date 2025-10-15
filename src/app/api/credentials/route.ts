import { NextResponse, NextRequest } from 'next/server';
import mongoose from 'mongoose';
import CredentialModel from '@/data/credentials';
import path from 'path';
import { writeFile } from 'fs/promises';
import { CredentialStatus } from '@/types';

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

async function connectToDb() {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(MONGODB_URI);
}

// --- GET: Fetch all credentials ---
export async function GET() {
  try {
    await connectToDb();
    const credentials = await CredentialModel.find({}).sort({ _id: -1 });
    return NextResponse.json(credentials);
  } catch (error) {
    console.error('API GET Error:', error);
    // FIX: Added the missing return statement below
    return NextResponse.json({ message: 'Failed to fetch credentials' }, { status: 500 });
  }
}

// --- POST: Handle file upload ---
export async function POST(request: NextRequest) {
  try {
    await connectToDb();
    const data = await request.formData();
    const file: File | null = data.get('certificate') as unknown as File;
    const title = data.get('title') as string;
    const issuer = data.get('issuer') as string;
    const date = data.get('date') as string;
    const skills = data.get('skills') as string;

    if (!file || !title || !issuer || !date || !skills) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileExtension = path.extname(file.name);
    const newFilename = `${Date.now()}${fileExtension}`;
    const filePath = `/uploads/${newFilename}`;
    
    await writeFile(path.join(process.cwd(), 'public', filePath), buffer);

    
    const status: CredentialStatus = 'Verifying';


    const newCredential = new CredentialModel({
      title,
      issuer,
      date,
      skills: skills.split(',').map(s => s.trim()),
      status, // Use the new initial status
      filePath,
      group: null,
    });

    await newCredential.save();
    return NextResponse.json(newCredential, { status: 201 });
  } catch (error) {
    console.error('API POST Error:', error);
    return NextResponse.json({ message: 'Failed to create credential.', error: (error as Error).message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    await connectToDb();
    const { id, status }: { id: string, status: CredentialStatus } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ message: 'ID and new status are required' }, { status: 400 });
    }

    const updatedCredential = await CredentialModel.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated document
    );

    if (!updatedCredential) {
      return NextResponse.json({ message: 'Credential not found' }, { status: 404 });
    }

    return NextResponse.json(updatedCredential, { status: 200 });
  } catch (error) {
    console.error('API PATCH Error:', error);
    return NextResponse.json({ message: 'Failed to update credential status' }, { status: 500 });
  }
}



// --- DELETE: Delete a credential ---
export async function DELETE(request: Request) {
  try {
    await connectToDb();
    const { id }: { id: string } = await request.json();

    if (!id) {
        return NextResponse.json({ message: 'Credential ID is required' }, { status: 400 });
    }
    
    await CredentialModel.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Credential deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('API DELETE Error:', error);
    // FIX: Added the missing return statement below
    return NextResponse.json({ message: 'Failed to delete credential.', error: (error as Error).message }, { status: 500 });
  }
}