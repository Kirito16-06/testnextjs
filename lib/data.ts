// Mock data store for the admin panel
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'moderator'
  status: 'active' | 'inactive'
  createdAt: string
  avatar?: string
}

export interface Product {
  id: string
  name: string
  price: number
  category: string
  stock: number
  status: 'active' | 'inactive'
  createdAt: string
  image?: string
}

export interface Order {
  id: string
  userId: string
  userName: string
  userEmail: string
  products: Array<{
    productId: string
    productName: string
    quantity: number
    price: number
  }>
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
}

// Mock data
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-10T14:20:00Z',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'moderator',
    status: 'inactive',
    createdAt: '2024-01-05T09:15:00Z',
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-12T16:45:00Z',
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-08T11:30:00Z',
  },
]

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 299.99,
    category: 'Electronics',
    stock: 45,
    status: 'active',
    createdAt: '2024-01-10T10:00:00Z',
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 399.99,
    category: 'Electronics',
    stock: 23,
    status: 'active',
    createdAt: '2024-01-08T14:30:00Z',
  },
  {
    id: '3',
    name: 'Coffee Maker',
    price: 149.99,
    category: 'Home & Kitchen',
    stock: 12,
    status: 'active',
    createdAt: '2024-01-12T09:20:00Z',
  },
  {
    id: '4',
    name: 'Bluetooth Speaker',
    price: 79.99,
    category: 'Electronics',
    stock: 0,
    status: 'inactive',
    createdAt: '2024-01-05T15:45:00Z',
  },
  {
    id: '5',
    name: 'Desk Lamp',
    price: 59.99,
    category: 'Home & Kitchen',
    stock: 34,
    status: 'active',
    createdAt: '2024-01-14T12:10:00Z',
  },
]

export const mockOrders: Order[] = [
  {
    id: '1001',
    userId: '2',
    userName: 'Jane Smith',
    userEmail: 'jane@example.com',
    products: [
      {
        productId: '1',
        productName: 'Wireless Headphones',
        quantity: 1,
        price: 299.99,
      },
    ],
    total: 299.99,
    status: 'delivered',
    createdAt: '2024-01-15T08:30:00Z',
  },
  {
    id: '1002',
    userId: '4',
    userName: 'Sarah Wilson',
    userEmail: 'sarah@example.com',
    products: [
      {
        productId: '2',
        productName: 'Smart Watch',
        quantity: 1,
        price: 399.99,
      },
      {
        productId: '5',
        productName: 'Desk Lamp',
        quantity: 2,
        price: 59.99,
      },
    ],
    total: 519.97,
    status: 'processing',
    createdAt: '2024-01-14T16:20:00Z',
  },
  {
    id: '1003',
    userId: '5',
    userName: 'David Brown',
    userEmail: 'david@example.com',
    products: [
      {
        productId: '3',
        productName: 'Coffee Maker',
        quantity: 1,
        price: 149.99,
      },
    ],
    total: 149.99,
    status: 'shipped',
    createdAt: '2024-01-13T11:45:00Z',
  },
  {
    id: '1004',
    userId: '2',
    userName: 'Jane Smith',
    userEmail: 'jane@example.com',
    products: [
      {
        productId: '4',
        productName: 'Bluetooth Speaker',
        quantity: 1,
        price: 79.99,
      },
    ],
    total: 79.99,
    status: 'pending',
    createdAt: '2024-01-12T14:15:00Z',
  },
]

// In-memory store (in a real app, this would be a database)
let users = [...mockUsers]
let products = [...mockProducts]
let orders = [...mockOrders]

export const dataStore = {
  users: {
    getAll: () => users,
    getById: (id: string) => users.find(u => u.id === id),
    create: (user: Omit<User, 'id' | 'createdAt'>) => {
      const newUser: User = {
        ...user,
        id: (users.length + 1).toString(),
        createdAt: new Date().toISOString(),
      }
      users.push(newUser)
      return newUser
    },
    update: (id: string, updates: Partial<User>) => {
      const index = users.findIndex(u => u.id === id)
      if (index === -1) return null
      users[index] = { ...users[index], ...updates }
      return users[index]
    },
    delete: (id: string) => {
      const index = users.findIndex(u => u.id === id)
      if (index === -1) return false
      users.splice(index, 1)
      return true
    },
  },
  products: {
    getAll: () => products,
    getById: (id: string) => products.find(p => p.id === id),
    create: (product: Omit<Product, 'id' | 'createdAt'>) => {
      const newProduct: Product = {
        ...product,
        id: (products.length + 1).toString(),
        createdAt: new Date().toISOString(),
      }
      products.push(newProduct)
      return newProduct
    },
    update: (id: string, updates: Partial<Product>) => {
      const index = products.findIndex(p => p.id === id)
      if (index === -1) return null
      products[index] = { ...products[index], ...updates }
      return products[index]
    },
    delete: (id: string) => {
      const index = products.findIndex(p => p.id === id)
      if (index === -1) return false
      products.splice(index, 1)
      return true
    },
  },
  orders: {
    getAll: () => orders,
    getById: (id: string) => orders.find(o => o.id === id),
    create: (order: Omit<Order, 'id' | 'createdAt'>) => {
      const newOrder: Order = {
        ...order,
        id: (1000 + orders.length + 1).toString(),
        createdAt: new Date().toISOString(),
      }
      orders.push(newOrder)
      return newOrder
    },
    update: (id: string, updates: Partial<Order>) => {
      const index = orders.findIndex(o => o.id === id)
      if (index === -1) return null
      orders[index] = { ...orders[index], ...updates }
      return orders[index]
    },
    delete: (id: string) => {
      const index = orders.findIndex(o => o.id === id)
      if (index === -1) return false
      orders.splice(index, 1)
      return true
    },
  },
}