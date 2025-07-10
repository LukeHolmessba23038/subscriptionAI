import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'
import SubscriptionList from './SubscriptionList.jsx'
import AddSubscriptionForm from './AddSubscriptionForm.jsx'
import {
  getSubscriptions,
  deleteSubscription,
} from '../services/subscriptionService.js'

export default function Dashboard() {
  const { currentUser, loading: authLoading } = useContext(AuthContext)
  const [subscriptions, setSubscriptions] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [subscriptionToEdit, setSubscriptionToEdit] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchSubscriptions = async () => {
    if (!currentUser) return
    setLoading(true)
    try {
      const subs = await getSubscriptions(currentUser.uid)
      setSubscriptions(subs)
    } catch (err) {
      console.error('Failed to fetch subscriptions', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading && currentUser) {
      fetchSubscriptions()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, currentUser])

  const handleAddClick = () => {
    setSubscriptionToEdit(null)
    setIsModalOpen(true)
  }

  const handleEdit = (sub) => {
    setSubscriptionToEdit(sub)
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!currentUser) return
    try {
      await deleteSubscription(currentUser.uid, id)
      fetchSubscriptions()
    } catch (err) {
      console.error('Failed to delete subscription', err)
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSubscriptionToEdit(null)
    // Refresh list after form closes (add/update)
    fetchSubscriptions()
  }

  if (authLoading) {
    return <p className="text-center mt-10 text-gray-600">Loading user...</p>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Your Subscriptions</h1>
        <button
          onClick={handleAddClick}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add New Subscription
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading subscriptions...</p>
      ) : (
        <SubscriptionList
          subscriptions={subscriptions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {isModalOpen && (
        <AddSubscriptionForm
          onClose={handleModalClose}
          subscriptionToEdit={subscriptionToEdit}
        />
      )}
    </div>
  )
}