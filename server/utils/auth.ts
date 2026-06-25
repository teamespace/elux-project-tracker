declare module '#auth-utils' {
  interface User {
    id: string
    name: string
    initials: string
    avatar?: string
    role: 'admin' | 'manager' | 'member' | 'intern'
  }
  interface UserSession {
    user: User
  }
}

export {}
