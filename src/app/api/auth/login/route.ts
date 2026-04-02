import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { findUserByEmail } from '@/lib/database';
import { createSessionToken, getSessionCookieConfig } from '@/lib/session';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Compare password
    const isValidPassword = await bcrypt.compare(password, user.hashedPassword);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Remove password from returned user object
    const { hashedPassword, ...userWithoutPassword } = user;

    const token = await createSessionToken({
      id: userWithoutPassword.id,
      email: userWithoutPassword.email,
      name: userWithoutPassword.name,
      role: userWithoutPassword.role,
    });

    const response = NextResponse.json({
      success: true,
      user: userWithoutPassword,
    });

    response.cookies.set(getSessionCookieConfig(token));

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred during login' },
      { status: 500 }
    );
  }
}