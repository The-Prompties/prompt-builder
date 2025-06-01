import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    context: { params: Promise<{ id: number }> }
) {
    const promptId = (await context.params).id;
    try {
        const prompt = await prisma.prompt.findUnique({
            where: {
                id: promptId
            },
            include: {
                user: {
                    select: {
                        login: true
                    }
                }
            }
        });

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
        }

        return NextResponse.json(prompt);
    } catch (error) {
        console.error('Error in GET /api/prompts/[id]:', error);
        return NextResponse.json({
            error: 'Internal Server Error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    context: { params: Promise<{ id: number }> }
) {
    const promptId = (await context.params).id;
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { title, description, content } = await request.json();

        if (!title || !description || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const prompt = await prisma.prompt.findUnique({
            where: {
                id: promptId,
                userId: session.user.id
            }
        });

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
        }

        const updatedPrompt = await prisma.prompt.update({
            where: {
                id: promptId
            },
            data: {
                title,
                description,
                content
            }
        });

        return NextResponse.json(updatedPrompt);
    } catch (error) {
        console.error('Error in PUT /api/prompts/[id]:', error);
        return NextResponse.json({ 
            error: 'Internal Server Error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 