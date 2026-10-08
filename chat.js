const input = document.getElementById("composer-input");
const sendButton = document.getElementById("send-btn");
const chatLog = document.getElementById("chat-log");

function addMessage(text, role, pending = false) {
  const message = document.createElement("div");
  message.className = `chat-message ${role}${pending ? " pending" : ""}`;
  message.textContent = text;
  chatLog.appendChild(message);
  chatLog.scrollTop = chatLog.scrollHeight;
  return message;
}

function resizeInput() {
  input.style.height = "auto";
  input.style.height = `${Math.min(input.scrollHeight, 160)}px`;
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text || sendButton.disabled) return;

  addMessage(text, "user");
  input.value = "";
  resizeInput();
  sendButton.disabled = true;
  const pendingMessage = addMessage("Sol is thinking…", "assistant", true);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unable to get a response.");

    pendingMessage.textContent = data.response;
    pendingMessage.classList.remove("pending");
  } catch (error) {
    pendingMessage.textContent = error.message || "Something went wrong. Please try again.";
    pendingMessage.classList.remove("pending");
  } finally {
    sendButton.disabled = false;
    input.focus();
  }
}

sendButton.addEventListener("click", sendMessage);
input.addEventListener("input", resizeInput);
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});


module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const r = await fetch(`${process.env.OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OLLAMA_MODEL || "llama3.1",
        messages: req.body.messages,
        stream: false,
      }),
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (err) {
    res.status(502).json({ error: "Could not reach Ollama" });
  }
};