import React from 'react'
import SubscriptionItem from './SubscriptionItem.jsx'

export default function SubscriptionList({ subscriptions = [], onEdit, onDelete }) {
  if (!subscriptions.length) {
    return <p className="text-center text-gray-500">No subscriptions found.</p>
  }

  return (
    <div className="space-y-3">
      {subscriptions.map((sub) => (
        <SubscriptionItem
          key={sub.id}
          subscription={sub}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}