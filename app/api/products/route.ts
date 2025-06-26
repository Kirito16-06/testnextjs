import { NextRequest, NextResponse } from 'next/server'
import { dataStore } from '@/lib/data'

export async function GET() {
  try {
    const products = dataStore.products.getAll()
    return NextResponse.json({ products })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, price, category, stock, status } = body

    if (!name || price === undefined || !category || stock === undefined || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const newProduct = dataStore.products.create({ name, price, category, stock, status })
    return NextResponse.json({ product: newProduct }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}