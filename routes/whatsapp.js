const express = require('express');
const router = express.Router();
const { sendMessageToAssistant } = require('../services/openai');

router.post('/incoming', async (req, res) => {
    const userMessage = req.body.Body;
    const sender = req.body.From;

    console.log(`📩 Message from ${sender}: ${userMessage}`);

    try {
        const reply = await sendMessageToAssistant(userMessage);

        return res.send(
            `<Response><Message>${reply}</Message></Response>`
        );
    } catch (err) {
        console.error("❌ Error:", err);
        return res.send(
            `<Response><Message>Error processing request</Message></Response>`
        );
    }
});

module.exports = router;
