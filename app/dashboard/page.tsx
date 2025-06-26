'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Package, ShoppingCart, TrendingUp } from 'lucide-react'
import { dataStore, User, Product, Order } from '@/lib/data'

interface Stats {
  totalUsers: number
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  activeUsers: number
  lowStockProducts: number
  pendingOrders: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const calculateStats = () => {
      const users = dataStore.users.getAll()
      const products = dataStore.products.getAll()
      const orders = dataStore.orders.getAll()

      const stats: Stats = {
        totalUsers: users.length,
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
        activeUsers: users.filter(user => user.status === 'active').length,
        lowStockProducts: products.filter(product => product.stock < 20).length,
        pendingOrders: orders.filter(order => order.status === 'pending').length,
      }

      setStats(stats)
      setLoading(false)
    }

    calculateStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!stats) return null

  const cardData = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      description: `${stats.activeUsers} active users`,
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      description: `${stats.lowStockProducts} low stock`,
      icon: Package,
      color: 'text-green-600',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      description: `${stats.pendingOrders} pending`,
      icon: ShoppingCart,
      color: 'text-purple-600',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      description: 'All time revenue',
      icon: TrendingUp,
      color: 'text-orange-600',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your admin panel. Here's an overview of your system.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cardData.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest activities in your system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New user registered</p>
                <p className="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Order #1004 completed</p>
                <p className="text-xs text-muted-foreground">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Product stock low</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>
              Key metrics at a glance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Active Users</span>
              <span className="font-medium">{stats.activeUsers}/{stats.totalUsers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Products in Stock</span>
              <span className="font-medium">{stats.totalProducts - stats.lowStockProducts}/{stats.totalProducts}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Completed Orders</span>
              <span className="font-medium">{stats.totalOrders - stats.pendingOrders}/{stats.totalOrders}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Average Order Value</span>
              <span className="font-medium">${(stats.totalRevenue / stats.totalOrders).toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}