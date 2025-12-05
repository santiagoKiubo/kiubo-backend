const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID;

console.log("🔑 API key present:", !!process.env.OPENAI_API_KEY);
console.log("🤖 Assistant ID:", ASSISTANT_ID ? ASSISTANT_ID.slice(0, 8) + "..." : null);


async function sendMessageToAssistant(userMessage) {
  try {
    if (!process.env.OPENAI_API_KEY) {
  console.error("❌ Missing OPENAI_API_KEY env var");
  return "Lo siento, hubo un error procesando tu mensaje.";
}

    if (!ASSISTANT_ID) {
      console.error("❌ Missing OPENAI_ASSISTANT_ID env var");
      return "Lo siento, hubo un error procesando tu mensaje.";
    }

    // 1) Create a thread with the user message
    const thread = await client.beta.threads.create({
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    console.log("🧵 Thread ID:", thread.id);

    // 2) Create a run for this thread using your Assistant
    const run = await client.beta.threads.runs.create(thread.id, {
      assistant_id: ASSISTANT_ID,
    });

    console.log("🏃 Run ID:", run.id);

    // 3) Poll the run status until it finishes
    let runStatus = await client.beta.threads.runs.retrieve(thread.id, run.id);
    console.log("🔄 Initial run status:", runStatus.status);

    while (runStatus.status === "queued" || runStatus.status === "in_progress") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      runStatus = await client.beta.threads.runs.retrieve(thread.id, run.id);
      console.log("🔄 Polled run status:", runStatus.status);
    }

    if (runStatus.status !== "completed") {
      console.error("⚠️ Run did not complete:", runStatus);
      return "Lo siento, hubo un error procesando tu mensaje.";
    }

    // 4) Get the latest assistant message from this thread
    const messages = await client.beta.threads.messages.list(thread.id, {
      order: "desc",
      limit: 10,
    });

    const assistantMessage = messages.data.find(
      (m) => m.role === "assistant"
    );

    if (!assistantMessage) {
      console.error("⚠️ No assistant message found:", messages.data);
      return "Lo siento, no pude generar una respuesta.";
    }

    // 5) Extract text content from the assistant message
    const textBlock = assistantMessage.content.find(
      (c) => c.type === "text"
    );

    const text =
      (textBlock && textBlock.text && textBlock.text.value) ||
      (textBlock && textBlock.text) ||
      "";

    if (!text) {
      console.error(
        "⚠️ Assistant message has no text content:",
        JSON.stringify(assistantMessage, null, 2)
      );
      return "Lo siento, la respuesta llegó en un formato que no pude leer.";
    }

    return text;
  } catch (err) {
    console.error(
      "❌ OpenAI Error:",
      err?.response?.data || err?.message || err
    );
    return "Lo siento, hubo un error procesando tu mensaje.";
  }
}

module.exports = { sendMessageToAssistant };