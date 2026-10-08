module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const message = req.body && req.body.message;
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message is required." });
  }

  if (!process.env.OLLAMA_URL) {
    return res.status(500).json({ error: "OLLAMA_URL is not set on the server." });
  }

  try {
    const ollamaResponse = await fetch(`${process.env.OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OLLAMA_MODEL || "llama3.1",
        stream: false,
        messages: [
          { role: "system", content: "You are Sol, a helpful and friendly assistant." },
          { role: "user", content: message },
        ],
      }),
    });

    if (!ollamaResponse.ok) {
      return res.status(502).json({
        error: `Ollama returned an error (${ollamaResponse.status}). Check that the tunnel and model are running.`,
      });
    }

    const data = await ollamaResponse.json();
    return res.status(200).json({ response: data.message.content });
  } catch (err) {
    return res.status(502).json({
      error: "Could not reach Ollama. Is your PC on and the tunnel running?",
    });
  }
};