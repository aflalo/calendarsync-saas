import { NextRequest, NextResponse } from 'next/server'

let users: Record<string, any> = {}
let nextUserId = 1

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (Object.values(users).some((u: any) => u.email === email)) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    const userId = String(nextUserId++)
    users[userId] = {
      id: userId,
      email,
      password,
      name,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(
      {
        id: userId,
        email,
        name,
        message: 'User created successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}
