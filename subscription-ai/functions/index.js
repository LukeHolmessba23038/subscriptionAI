const functions = require('firebase-functions')

// Simple HTTP function for testing purposes
exports.helloWorld = functions.https.onRequest((req, res) => {
  res.send('Hello from Firebase!')
})

const { GoogleGenerativeAI } = require('@google/generative-ai')

// HTTP function to test Gemini text generation
exports.testGemini = functions.https.onRequest(async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed')
  }

  const { text } = req.body || {}
  if (!text) {
    return res.status(400).json({ error: 'Missing "text" in request body' })
  }

  try {
    // TODO: Replace with Secret Manager or environment config in production
    const genAI = new GoogleGenerativeAI('YOUR_GEMINI_API_KEY')

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const result = await model.generateContent(text)
    const aiText = result?.response?.text() || ''

    return res.json({ prompt: text, response: aiText })
  } catch (error) {
    console.error('Gemini API error:', error)
    return res.status(500).json({ error: 'Failed to generate content' })
  }
})

const admin = require('firebase-admin')
admin.initializeApp()

const { google } = require('googleapis')

// Replace with your OAuth 2.0 Client credentials or load from Secret Manager.
const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'
const CLIENT_SECRET = 'YOUR_GOOGLE_CLIENT_SECRET'
const REDIRECT_URI = 'YOUR_REDIRECT_URI'
// Gemini API key placeholder (replace with Secret Manager in prod)
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY'

// Run daily at 03:00 UTC
exports.fetchEmails = functions.pubsub
  .schedule('0 3 * * *')
  .timeZone('UTC')
  .onRun(async (context) => {
    console.log('Running scheduled email fetch job...')

    try {
      // Example location for refresh tokens: /emailTokens/{uid} -> { refresh_token }
      const snapshot = await admin.firestore().collection('emailTokens').get()
      if (snapshot.empty) {
        console.log('No connected users found.')
        return null
      }

      // Iterate over each user with a stored refresh token
      for (const doc of snapshot.docs) {
        const { refresh_token } = doc.data()
        const uid = doc.id
        if (!refresh_token) continue

        try {
          const oAuth2Client = new google.auth.OAuth2(
            CLIENT_ID,
            CLIENT_SECRET,
            REDIRECT_URI
          )
          oAuth2Client.setCredentials({ refresh_token })

          // Obtain a fresh access token silently
          const { token } = await oAuth2Client.getAccessToken()
          oAuth2Client.setCredentials({ access_token: token })

          const gmail = google.gmail({ version: 'v1', auth: oAuth2Client })

          // Query emails from last 24h containing subscription keywords
          const query =
            'newer_than:1d (subscription OR receipt OR renewal OR bill)'
          const msgList = await gmail.users.messages.list({ userId: 'me', q: query, maxResults: 10 })

          const messages = msgList.data.messages || []
          console.log(`User ${uid} - found ${messages.length} messages`) 

          for (const msg of messages) {

            // Fetch full message to access body content
            const msgData = await gmail.users.messages.get({
              userId: 'me',
              id: msg.id,
              format: 'full',
            })

            // Helper to decode base64url text
            const decodeB64 = (str) =>
              Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')

            // Recursive function to find plain-text part
            const getPlainText = (payload) => {
              if (!payload) return ''
              if (
                payload.mimeType === 'text/plain' &&
                payload.body &&
                payload.body.data
              ) {
                return decodeB64(payload.body.data)
              }
              if (payload.parts && payload.parts.length) {
                for (const p of payload.parts) {
                  const txt = getPlainText(p)
                  if (txt) return txt
                }
              }
              return ''
            }

            const plainText = getPlainText(msgData.data.payload)

            // Extract subject and sender for logging
            const headers = msgData.data.payload.headers
            const subjectHeader = headers.find((h) => h.name === 'Subject') || {}
            const fromHeader = headers.find((h) => h.name === 'From') || {}

            console.log(
              `User ${uid} - Email: Subject="${subjectHeader.value}" From="${fromHeader.value}"`
            )

            if (!plainText) {
              console.log(`User ${uid} - No plain text found for message ${msg.id}`)
              continue
            }

            // Send to Gemini for structured extraction
            try {
              const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
              const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

              const prompt = `You are an assistant that extracts subscription details from emails. ` +
                `Return ONLY valid JSON with the following fields: ` +
                `serviceName (string), cost (number), billingCycle (string), ` +
                `nextPaymentDate (ISO 8601 string or null), isTrial (boolean), ` +
                `trialEndDate (ISO 8601 string or null).\n\n` +
                `Email:\n${plainText}`

              const gemRes = await model.generateContent(prompt)
              const parsed = gemRes?.response?.text() || ''

              console.log(`Gemini parsed response for user ${uid}, msg ${msg.id}:`, parsed)
              // TODO: validate JSON, store into Firestore
            } catch (aiErr) {
              console.error(`Gemini parsing failed for user ${uid}, msg ${msg.id}:`, aiErr)
            }
          }
        } catch (userErr) {
          console.error(`Failed to fetch emails for user ${uid}:`, userErr)
        }
      }
    } catch (err) {
      console.error('Scheduled function error:', err)
    }

    return null
  })