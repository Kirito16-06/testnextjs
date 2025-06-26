// Simple authentication utilities
export interface Session {
  user: {
    id: string
    name: string
    email: string
    role: string
  }
  expires: string
}

// Mock session data (in a real app, this would use JWT or database sessions)
const mockSession: Session = {
  user: {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
}

export function getSession(): Session | null {
  // In a real app, this would check cookies/JWT tokens
  if (typeof window !== 'undefined') {
    const session = localStorage.getItem('admin-session')
    if (session) {
      const parsed = JSON.parse(session)
      if (new Date(parsed.expires) > new Date()) {
        return parsed
      }
      localStorage.removeItem('admin-session')
    }
  }
  return null
}

export function createSession(email: string, password: string): Session | null {
  // Simple mock authentication
  if (email === 'admin@example.com' && password === 'admin123') {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin-session', JSON.stringify(mockSession))
    }
    return mockSession
  }
  return null
}

export function destroySession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin-session')
  }
}

export function requireAuth(): Session {
  const session = getSession()
  if (!session) {
    throw new Error('Authentication required')
  }
  return session
}