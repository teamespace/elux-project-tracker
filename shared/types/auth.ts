export interface SessionUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'member' | 'intern'
}
