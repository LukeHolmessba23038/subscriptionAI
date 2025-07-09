import React from 'react'

export default function SubscriptionItem({ subscription, onEdit, onDelete }) {
  if (!subscription) return null

  const { serviceName, cost, billingCycle, category } = subscription

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow rounded-lg">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{serviceName}</h3>
        <p className="text-sm text-gray-600">
          {billingCycle} | {category}
        </p>
      </div>

      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium text-gray-900">${cost}</span>
        <button
          type="button"
          onClick={() => onEdit && onEdit(subscription)}
          className="px-3 py-1 text-sm border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition-colors"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete && onDelete(subscription.id)}
          className="px-3 py-1 text-sm border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  )
}