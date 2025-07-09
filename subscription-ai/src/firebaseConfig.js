import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'

// TODO: Replace the placeholder values with your project-specific Firebase credentials.
const firebaseConfig = {
  apiKey: 'AIzaSyASCkjXFTWrRXEU4Re1SMaY8zqK59zKRc4',
  authDomain: 'ai-subscriptions-8d7fa.firebaseapp.com',
  projectId: 'ai-subscriptions-8d7fa',
  storageBucket: 'ai-subscriptions-8d7fa.firebasestorage.app',
  messagingSenderId: '491855997439',
  appId: '1:491855997439:web:b79b1b085b32f23ac75fca',
  measurementId: 'G-1MCVJZ0YWJ',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
const auth = getAuth(app)
const db = getFirestore(app)
const functions = getFunctions(app)

// Connect to Firebase Local Emulator Suite in development
if (import.meta.env.DEV) {
  // Auth Emulator
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })

  // Firestore Emulator
  connectFirestoreEmulator(db, 'localhost', 8080)

  // Cloud Functions Emulator
  connectFunctionsEmulator(functions, 'localhost', 5001)
}

export { auth, db, functions }