// Import required modules
const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors());

// Your serverless function logic
app.post('/completions', async (req, res) => {
  try {
    // Extract data from the request body
    const requestData = req.body;

    // Example: Assuming requestData.message contains the required data
    const gpt_input = `Only use items in this list that are food and return a recipe with step-by-step instructions that use those ingredients: ${requestData.message}`;

    // Set up options for the API call
    const options = {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.REACT_APP_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: gpt_input }],
        max_tokens: 100,
      })
    };

    // Make API call to OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', options);
    const data = await response.json();

    // Respond with success and the data received
    res.status(200).json(data);
  } catch (error) {
    // Handle errors and respond with an error status code
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Export the Express app as the handler for Netlify
exports.handler = app;