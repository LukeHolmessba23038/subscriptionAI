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