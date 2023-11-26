const PORT = process.env.PORT || 8000;
const express = require('express');
const cors = require('cors');
const app = express();
// const env = require('./env');

app.use(express.json());
app.use(cors());

const API_KEY = process.env.REACT_APP_API_KEY;

app.post('/completions', async (req, res) => {
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: req.body.message}],
            max_tokens: 100,
        })
    }

    try{
        /* pass through some options to this ex. what kind of req its going to be */
        const response = await fetch('https://api.openai.com/v1/chat/completions', options);
        const data = await response.json();
        res.send(data);
    } catch(error) {
        console.error(error);
    }
});

/* callback function - PORT as first param, and other part as second param */
app.listen(PORT, () => console.log('Your server is running on PORT ' + PORT));