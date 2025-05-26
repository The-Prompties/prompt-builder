import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const prompts = await prisma.prompt.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            login: true
          }
        }
      }
    });

    return NextResponse.json(prompts);
  } catch (error) {
    console.error('Error in GET /api/prompts/latest:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 