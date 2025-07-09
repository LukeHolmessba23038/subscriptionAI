import { render, screen, fireEvent } from '@testing-library/react'
import SubscriptionItem from '../SubscriptionItem.jsx'

const dummySubscription = {
  id: 'sub-1',
  serviceName: 'Netflix',
  cost: 15.99,
  billingCycle: 'Monthly',
  category: 'Entertainment',
}

describe('SubscriptionItem', () => {
  it('renders subscription details correctly', () => {
    render(
      <SubscriptionItem subscription={dummySubscription} onEdit={() => {}} onDelete={() => {}} />
    )

    expect(screen.getByText('Netflix')).toBeInTheDocument()
    expect(screen.getByText('$15.99')).toBeInTheDocument()
    expect(screen.getByText(/Monthly/i)).toBeInTheDocument()
    expect(screen.getByText(/Entertainment/i)).toBeInTheDocument()
  })

  it('calls onDelete when Delete button is clicked', () => {
    const handleDelete = vi.fn()
    render(
      <SubscriptionItem subscription={dummySubscription} onEdit={() => {}} onDelete={handleDelete} />
    )

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)

    expect(handleDelete).toHaveBeenCalledTimes(1)
    expect(handleDelete).toHaveBeenCalledWith('sub-1')
  })
})