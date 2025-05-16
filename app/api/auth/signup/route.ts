// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { login, password } = await request.json();

        if (!login || !password) {
            return NextResponse.json({ error: 'Login and password are required' }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { login },
        });

        if (existingUser) {
            return NextResponse.json({ error: 'User with this login already exists' }, { status: 409 }); // Conflict
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await prisma.user.create({
            data: {
                login,
                password: hashedPassword,
            },
        });

        // In a real app, you'd establish a session here after successful creation
        // For this demo, we just return success
        return NextResponse.json({ message: 'User created successfully', userId: newUser.id }, { status: 201 });

    } catch (error: any) {
        console.error('Signup error:', error);
        return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
    }
}