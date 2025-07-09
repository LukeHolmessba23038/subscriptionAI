import React, { useState } from 'react'

export default function ConnectEmail() {
  const [isConnected, setIsConnected] = useState(false)

  const handleConnect = () => {
    // Build Google OAuth 2.0 authorization URL (placeholder values)
    const params = new URLSearchParams({
      client_id: 'YOUR_GOOGLE_CLIENT_ID',
      redirect_uri: window.location.origin + '/oauth2callback',
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/gmail.readonly',
      access_type: 'offline',
      prompt: 'consent',
    })

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`

    console.log('OAuth redirect URL:', authUrl)
    // For now we just log; in the future we'll redirect:
    // window.location.href = authUrl
  }

  return (
    <div className="p-4 bg-white shadow rounded-lg max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">Email Connection</h2>
      <p className="mb-4 text-gray-700">
        Status: <span className="font-medium">{isConnected ? 'Connected' : 'Not connected'}</span>
      </p>
      <button
        onClick={handleConnect}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Connect Gmail Account
      </button>
    </div>
  )
}