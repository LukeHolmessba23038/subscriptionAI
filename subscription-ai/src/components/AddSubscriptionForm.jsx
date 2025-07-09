import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'
import {
  addSubscription,
  updateSubscription,
} from '../services/subscriptionService.js'

export default function AddSubscriptionForm({ onClose, subscriptionToEdit }) {
  const { currentUser } = useContext(AuthContext)

  const [serviceName, setServiceName] = useState('')
  const [cost, setCost] = useState('')
  const [billingCycle, setBillingCycle] = useState('Monthly')
  const [category, setCategory] = useState('')
  const [nextPaymentDate, setNextPaymentDate] = useState('')
  const [isTrial, setIsTrial] = useState(false)
  const [trialEndDate, setTrialEndDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Pre-fill form when editing
  useEffect(() => {
    if (subscriptionToEdit) {
      const {
        serviceName,
        cost,
        billingCycle,
        category,
        nextPaymentDate,
        isTrial,
        trialEndDate,
      } = subscriptionToEdit
      setServiceName(serviceName || '')
      setCost(cost || '')
      setBillingCycle(billingCycle || 'Monthly')
      setCategory(category || '')
      setNextPaymentDate(
        nextPaymentDate ? new Date(nextPaymentDate).toISOString().substr(0, 10) : ''
      )
      setIsTrial(!!isTrial)
      setTrialEndDate(
        trialEndDate ? new Date(trialEndDate).toISOString().substr(0, 10) : ''
      )
    }
  }, [subscriptionToEdit])

  const resetForm = () => {
    setServiceName('')
    setCost('')
    setBillingCycle('Monthly')
    setCategory('')
    setNextPaymentDate('')
    setIsTrial(false)
    setTrialEndDate('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!currentUser) return

    const data = {
      serviceName,
      cost: parseFloat(cost),
      billingCycle,
      category,
      nextPaymentDate: nextPaymentDate ? new Date(nextPaymentDate).toISOString() : null,
      isTrial,
      trialEndDate: trialEndDate ? new Date(trialEndDate).toISOString() : null,
    }

    try {
      setLoading(true)
      if (subscriptionToEdit) {
        await updateSubscription(currentUser.uid, subscriptionToEdit.id, data)
      } else {
        await addSubscription(currentUser.uid, data)
      }
      resetForm()
      if (onClose) onClose()
    } catch (err) {
      console.error(err)
      setError('Failed to save subscription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">
          {subscriptionToEdit ? 'Edit Subscription' : 'Add Subscription'}
        </h2>
        {error && <p className="text-red-600 mb-3 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Service Name</label>
            <input
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cost ($)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Billing Cycle</label>
            <select
              value={billingCycle}
              onChange={(e) => setBillingCycle(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
              <option value="Weekly">Weekly</option>
              <option value="One-time">One-time</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Next Payment Date</label>
            <input
              type="date"
              value={nextPaymentDate}
              onChange={(e) => setNextPaymentDate(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="isTrial"
              type="checkbox"
              checked={isTrial}
              onChange={(e) => setIsTrial(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isTrial" className="text-sm text-gray-700">
              Trial
            </label>
          </div>

          {isTrial && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Trial End Date</label>
              <input
                type="date"
                value={trialEndDate}
                onChange={(e) => setTrialEndDate(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : subscriptionToEdit ? 'Update' : 'Add'} Subscription
          </button>
        </form>
      </div>
    </div>
  )
}