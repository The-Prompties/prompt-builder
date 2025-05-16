// app/api/user/orders/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
// You will need a way to get the authenticated user's ID here.
// This is where session/token management is crucial.
// For this demo, we'll SIMPLIFY and assume the user ID is passed as a query parameter
// or derived from a simple hypothetical authentication state.
// A real implementation would get the user ID from the server-side session/token.

export async function GET(request: Request) {
    try {
        // --- SIMPLIFIED AUTH DEMO ---
        // In a real app, get user ID from session/token here.
        // Example (Hypothetical):
        // const { userId } = getAuthenticatedUser(request); // Function to extract user from session
        // if (!userId) {
        //   return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        // }
        // --- END SIMPLIFIED AUTH DEMO ---

        // For THIS DEMO, let's manually get a user ID (e.g., the first user found)
        // Replace this with actual auth logic!
        const dummyUser = await prisma.user.findFirst(); // FIND THE FIRST USER
        const userId = dummyUser?.id;

        if (!userId) {
            // If no users exist or auth fails in a real app
            return NextResponse.json({ error: 'User not found or not authenticated' }, { status: 401 });
        }


        const orders = await prisma.order.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                createdAt: 'desc', // Show most recent orders first
            },
        });

        return NextResponse.json({ orders }, { status: 200 });

    } catch (error: any) {
        console.error('Fetch user orders error:', error);
        return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
    }
}