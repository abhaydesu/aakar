// src/app/api/credentials/route.ts
import { NextResponse } from 'next/server';
import { getCurrentUserSession } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Credential from '@/models/Credential';

export async function GET() {
  const session = await getCurrentUserSession();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    await dbConnect();
    const credentials = await Credential.find({ userId: session.user.id }).sort({ createdAt: -1 });
    return NextResponse.json(credentials);
  } catch (err) {
    console.error('GET /api/credentials error', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getCurrentUserSession();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('certificate') as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json({ message: 'File is required and cannot be empty.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString('base64');

    const newCredentialData = {
      userId: session.user.id,
      title: formData.get('title') as string,
      issuer: formData.get('issuer') as string,
      date: new Date(formData.get('date') as string),
      skills: (formData.get('skills') as string).split(',').map(s => s.trim()),
      fileData: base64Data,
      fileMimeType: file.type,
    };

    await dbConnect();
    const credential = new Credential(newCredentialData);
    await credential.save();

    return NextResponse.json(credential, { status: 201 });

  } catch (err) {
    console.error('POST /api/credentials error', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getCurrentUserSession();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, status } = await request.json();
    await dbConnect();
    const updatedCredential = await Credential.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { status },
      { new: true }
    );

    if (!updatedCredential) {
      return NextResponse.json({ message: 'Credential not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json(updatedCredential);
  } catch (err) {
    console.error('PATCH /api/credentials error', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getCurrentUserSession();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    await dbConnect();
    
    const result = await Credential.deleteOne({ _id: id, userId: session.user.id });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Credential not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Credential deleted successfully' }, { status: 200 });
  } catch (err) {
    console.error('DELETE /api/credentials error', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
