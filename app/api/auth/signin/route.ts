// app/api/auth/signin/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { comparePassword } from '@/lib/auth';

// NOTE: This is a SIMPLIFIED login without robust session management.
// In a production app, you would set secure HTTP-only cookies here
// using a library like 'next-iron-session' or integrate NextAuth.js.

export async function POST(request: Request) {
    try {
        const { login, password } = await request.json();

        if (!login || !password) {
            return NextResponse.json({ error: 'Login and password are required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { login },
        });

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 }); // Unauthorized
        }

        const passwordMatch = await comparePassword(password, user.password);

        if (!passwordMatch) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 }); // Unauthorized
        }

        // SUCCESSFUL LOGIN - SIMPLIFIED RESPONSE
        // In a real app, you would create and set a session cookie here.
        // For this demo, we just return a success message and user info (don't return password hash!)
        return NextResponse.json({ message: 'Login successful', userId: user.id, login: user.login }, { status: 200 });

    } catch (error: any) {
        console.error('Signin error:', error);
        return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
    }
}