require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/whatsapp', require('./routes/whatsapp'));


// Simple health check
app.get('/', (req, res) => {
  res.send('Kiubo backend OK');
});

// Temp WhatsApp route (we'll wire Twilio + OpenAI later)
app.post('/whatsapp/webhook', (req, res) => {
  console.log('✅ Received WhatsApp webhook:', req.body);
  res.send('OK');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Kiubo backend running on port ${PORT}`);
});