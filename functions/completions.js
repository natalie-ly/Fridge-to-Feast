const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  try {
    const requestData = JSON.parse(event.body);

    const gpt_input = `Only use items in this list that are food and return a recipe with step-by-step instructions that use those ingredients: ${requestData.message}`;

    const options = {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.REACT_APP_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: gpt_input }],
        max_tokens: 150,
      })
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', options);
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};