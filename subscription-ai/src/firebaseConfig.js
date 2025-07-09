import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

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

export { auth, db }