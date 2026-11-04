import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { api } from '../services/api'

export default function PublicRoute({ children }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.getMe()
        setAuthenticated(true)
      } catch {
        setAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-700 border-t-transparent" />
      </div>
    )
  }

  if (authenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}