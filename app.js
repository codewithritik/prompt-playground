const express = require('express');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const port = 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index', { outputs: [] });
});

app.post('/generate', async (req, res) => {
  const { model, systemPrompt, userPrompt, temperature, max_tokens, presence_penalty, frequency_penalty } = req.body;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  try {
    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature: parseFloat(temperature),
      max_tokens: parseInt(max_tokens),
      presence_penalty: parseFloat(presence_penalty),
      frequency_penalty: parseFloat(frequency_penalty),
    });

    const output = response.choices[0].message.content;
    res.render('index', { outputs: [{ model, temperature, max_tokens, presence_penalty, frequency_penalty, output }] });
  } catch (err) {
    console.error(err);
    res.send('Error occurred while calling OpenAI API.');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
