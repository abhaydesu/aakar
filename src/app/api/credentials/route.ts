import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Credential from '@/models/Credential';
import { authOptions } from '../auth/[...nextauth]/route';

// GET: Fetch all credentials for the logged-in user
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    await dbConnect();
    const credentials = await Credential.find({ userId: session.user.id }).sort({ createdAt: -1 });
    return NextResponse.json(credentials);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Create a new credential (with added debugging)
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    
    // --- Start Debugging Logs ---
    console.log("Server received request to create credential.");
    console.log("Form data keys received:", Array.from(formData.keys()));

    const file = formData.get('certificate') as File | null;

    if (!file || file.size === 0) {
      console.error("Validation failed: 'certificate' file is missing or empty.");
      return NextResponse.json({ message: 'File is required and cannot be empty.' }, { status: 400 });
    }

    console.log("File details:", { name: file.name, type: file.type, size: file.size });
    // --- End Debugging Logs ---

    // Convert file to Base64 string
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString('base64');

    console.log("File converted to Base64 string. Length:", base64Data.length);

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

    console.log("Credential saved to database successfully. ID:", credential._id);
    return NextResponse.json(credential, { status: 201 });

  } catch (error) {
    console.error("Error in POST /api/credentials:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH: Update a credential's status
export async function PATCH(request: Request) {
    const session = await getServerSession(authOptions);
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
    } catch (error) {
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  }

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
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
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}