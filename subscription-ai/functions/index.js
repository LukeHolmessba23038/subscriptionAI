const functions = require('firebase-functions')

// Simple HTTP function for testing purposes
exports.helloWorld = functions.https.onRequest((req, res) => {
  res.send('Hello from Firebase!')
})