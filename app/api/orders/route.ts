import { NextRequest, NextResponse } from 'next/server'
import { dataStore } from '@/lib/data'

export async function GET() {
  try {
    const orders = dataStore.orders.getAll()
    return NextResponse.json({ orders })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, userName, userEmail, products, total, status } = body

    if (!userId || !userName || !userEmail || !products || !total || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const newOrder = dataStore.orders.create({ 
      userId, 
      userName, 
      userEmail, 
      products, 
      total, 
      status 
    })
    return NextResponse.json({ order: newOrder }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}