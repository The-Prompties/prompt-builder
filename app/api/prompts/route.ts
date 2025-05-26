import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session in API:', session);

    if (!session?.user?.id) {
      console.log('No session or user ID');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    console.log('User ID:', userId);

    const prompts = await prisma.prompt.findMany({
      where: {
        userId: userId
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log('Found prompts:', prompts);
    return NextResponse.json(prompts);
  } catch (error) {
    console.error('Error in GET /api/prompts:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session in POST:', session);

    if (!session?.user?.id) {
      console.log('No session or user ID in POST');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    console.log('User ID in POST:', userId);

    const { title, description, content } = await request.json();

    if (!title || !description || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const prompt = await prisma.prompt.create({
      data: {
        title,
        description,
        content,
        userId: userId
      },
    });

    console.log('Created prompt:', prompt);
    return NextResponse.json(prompt, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/prompts:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 