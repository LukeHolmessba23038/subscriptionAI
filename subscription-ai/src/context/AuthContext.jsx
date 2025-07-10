import { createContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import { auth, db } from '../firebaseConfig'

export const AuthContext = createContext({
  currentUser: null,
  loading: true,
  db: null,
})

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Attempt anonymous sign-in on mount
    signInAnonymously(auth).catch((error) => {
      // You may want to handle errors differently in production
      console.error('Anonymous sign-in failed:', error)
    })

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ currentUser, db, loading }}>
      {children}
    </AuthContext.Provider>
  )
}