import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebaseConfig'

// You can set APP_ID to your Firebase appId or projectId for namespacing.
// Using the projectId from your Firebase configuration here.
const APP_ID = 'ai-subscriptions-8d7fa'

const subscriptionsCollection = (userId) =>
  collection(db, 'artifacts', APP_ID, 'users', userId, 'subscriptions')

export async function addSubscription(userId, subscriptionData) {
  const colRef = subscriptionsCollection(userId)
  const docRef = await addDoc(colRef, {
    ...subscriptionData,
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

export async function getSubscriptions(userId) {
  const colRef = subscriptionsCollection(userId)
  const snapshot = await getDocs(colRef)
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
}

export async function updateSubscription(userId, subscriptionId, updatedData) {
  const docRef = doc(db, 'artifacts', APP_ID, 'users', userId, 'subscriptions', subscriptionId)
  await updateDoc(docRef, { ...updatedData, updatedAt: serverTimestamp() })
}

export async function deleteSubscription(userId, subscriptionId) {
  const docRef = doc(db, 'artifacts', APP_ID, 'users', userId, 'subscriptions', subscriptionId)
  await deleteDoc(docRef)
}