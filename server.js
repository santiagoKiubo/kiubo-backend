require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// WhatsApp routes (all under /whatsapp)
app.use('/whatsapp', require('./routes/whatsapp'));

// Simple health check
app.get('/', (req, res) => {
  res.send('Kiubo backend OK');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Kiubo backend running on port ${PORT}`);
});