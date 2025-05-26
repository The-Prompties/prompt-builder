import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    try {
        const prompts = await prisma.prompt.findMany({
            where: {
                userId: session.user.id
            },
            orderBy: {
                createdAt: 'desc'
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
        });

        return NextResponse.json(prompts);
    } catch (error) {
        console.error('Error fetching user prompts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch prompts' },
            { status: 500 }
        );
    }
} 