// routes/whatsapp.js
const { createLead } = require("../services/leadsService");
const express = require("express");
const router = express.Router();
const twilio = require("twilio");
const { sendMessageToAssistant } = require("../services/openai");

router.post("/incoming", async (req, res) => {
  const rawMessage = req.body.Body || "";
  const userMessage = rawMessage.trim();
  const normalizedMessage = userMessage.toLowerCase();
  const sender = req.body.From;

  console.log("📩 Message from", sender, ":", userMessage);

  const twiml = new twilio.twiml.MessagingResponse();

  try {
    // 🔹 1) TEMP TEST: if user sends "lead", create a dummy lead in Supabase
    if (normalizedMessage === "lead") {
      const lead = await createLead({
        phone: sender,
        product: "gmm",                  // gastos médicos mayores
        name: "Test Lead",
        age: 30,
        city: "CDMX",
        incomeRange: "25k-40k",
        familyMembers: 2,
        currentInsurer: null,
        coverageAmount: "1M",
        preexistingConditions: "ninguna",
        assignedBrokerId: null,
      });

      console.log("✅ Lead saved with id:", lead.id);

      twiml.message(
        `Listo 🙌 Creé un lead de prueba en la base de datos con id ${lead.id}.`
      );
    } else {
      // 🔹 2) Default behaviour: send message to your OpenAI assistant
      const reply = await sendMessageToAssistant(userMessage, sender);
      twiml.message(reply);
    }

    res.type("text/xml");
    return res.send(twiml.toString());
  } catch (err) {
    console.error("❌ Error:", err);

    const errorTwiml = new twilio.twiml.MessagingResponse();
    errorTwiml.message(
      "Lo siento, tuve un problema procesando tu mensaje. Intenta de nuevo en un momento 🙏"
    );

    res.type("text/xml");
    return res.send(errorTwiml.toString());
  }
});

module.exports = router;
