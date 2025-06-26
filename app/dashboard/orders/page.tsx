'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/ui/data-table'
import { dataStore, Order } from '@/lib/data'
import { Eye, Edit } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [newStatus, setNewStatus] = useState('')

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = () => {
    const orderData = dataStore.orders.getAll()
    setOrders(orderData)
    setLoading(false)
  }

  const handleUpdateStatus = () => {
    if (editingOrder && newStatus) {
      const updated = dataStore.orders.update(editingOrder.id, { status: newStatus as any })
      if (updated) {
        setOrders(orders.map(o => o.id === editingOrder.id ? updated : o))
      }
      setEditingOrder(null)
      setNewStatus('')
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary',
      processing: 'default',
      shipped: 'default',
      delivered: 'default',
      cancelled: 'destructive',
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status}
      </Badge>
    )
  }

  const columns = [
    {
      key: 'id' as keyof Order,
      label: 'Order ID',
    },
    {
      key: 'userName' as keyof Order,
      label: 'Customer',
    },
    {
      key: 'userEmail' as keyof Order,
      label: 'Email',
    },
    {
      key: 'total' as keyof Order,
      label: 'Total',
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      key: 'status' as keyof Order,
      label: 'Status',
      render: (value: string) => getStatusBadge(value),
    },
    {
      key: 'createdAt' as keyof Order,
      label: 'Created',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'id' as keyof Order,
      label: 'Actions',
      render: (value: string, order: Order) => (
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewingOrder(order)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Order Details - #{order.id}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Customer</Label>
                    <p className="text-sm">{order.userName}</p>
                    <p className="text-sm text-muted-foreground">{order.userEmail}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <div className="mt-1">
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Products</Label>
                  <div className="mt-2 space-y-2">
                    {order.products.map((product, index) => (
                      <div key={index} className="flex justify-between items-center p-2 border rounded">
                        <div>
                          <p className="font-medium">{product.productName}</p>
                          <p className="text-sm text-muted-foreground">Qty: {product.quantity}</p>
                        </div>
                        <p className="font-medium">${(product.price * product.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="font-medium">Total</span>
                  <span className="text-lg font-bold">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingOrder(order)
                  setNewStatus(order.status)
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Order Status</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Order ID</Label>
                  <p className="text-sm">#{order.id}</p>
                </div>
                <div>
                  <Label>Customer</Label>
                  <p className="text-sm">{order.userName}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setEditingOrder(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateStatus}>
                    Update Status
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">
          Manage customer orders and their status.
        </p>
      </div>

      <DataTable 
        data={orders} 
        columns={columns} 
        searchKey="userName"
      />
    </div>
  )
}