import { NextRequest, NextResponse } from 'next/server'
import { dataStore } from '@/lib/data'

export async function GET() {
  try {
    const users = dataStore.users.getAll()
    return NextResponse.json({ users })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, role, status } = body

    if (!name || !email || !role || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const newUser = dataStore.users.create({ name, email, role, status })
    return NextResponse.json({ user: newUser }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}