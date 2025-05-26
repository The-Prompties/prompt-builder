import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    try {
        const [prompts, total] = await Promise.all([
            prisma.prompt.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc',
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    content: true,
                    createdAt: true,
                    userId: true,
                    user: {
                        select: {
                            login: true,
                            id: true,
                        },
                    },
                },
            }),
            prisma.prompt.count(),
        ]);

        return NextResponse.json({
            prompts,
            hasMore: skip + prompts.length < total,
        });
    } catch (error) {
        console.error('Error fetching prompts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch prompts' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    try {
        const { title, description, content } = await request.json();

        if (!title || !description || !content) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const prompt = await prisma.prompt.create({
            data: {
                title,
                description,
                content,
                userId: session.user.id,
            },
            include: {
                user: {
                    select: {
                        login: true,
                    },
                },
            },
        });

        return NextResponse.json(prompt);
    } catch (error) {
        console.error('Error creating prompt:', error);
        return NextResponse.json(
            { error: 'Failed to create prompt' },
            { status: 500 }
        );
    }
} 