// app/api/orders/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// NOTE: This API route doesn't enforce authentication yet.
// To link an order to a logged-in user, you would need to
// get the user's ID from the session/token in the request headers/cookies.
// For this demo, we'll assume the user ID is passed in the body if available,
// or the order is created without a userId if not logged in.

export async function POST(request: Request) {
    try {
        const { theme, description, referenceFile, userId } = await request.json(); // Expect userId optionally

        if (!theme || !description) {
            return NextResponse.json({ error: 'Theme and description are required' }, { status: 400 });
        }

        // Basic theme validation (should match themes allowed on the frontend)
        const allowedThemes = ['generate logo', 'make visualization'];
        if (!allowedThemes.includes(theme)) {
            return NextResponse.json({ error: 'Invalid theme provided' }, { status: 400 });
        }


        const newOrder = await prisma.order.create({
            data: {
                theme,
                description,
                referenceFile: referenceFile || null, // Allow null if not provided
                userId: userId ? parseInt(userId, 10) : null, // Link to user if userId is provided
            },
        });

        return NextResponse.json(newOrder, { status: 201 }); // Return the created order

    } catch (error: any) {
        console.error('Create order error:', error);
        // Check if error is related to foreign key constraint (invalid userId)
        if (error.code === 'P2003') { // Prisma Foreign Key Constraint failed code
            return NextResponse.json({ error: 'Invalid user ID provided' }, { status: 400 });
        }
        return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
    }
}