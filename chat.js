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

async function askOllama(prompt) {
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.1",
      prompt,
      stream: false
    })
  });

  if (!response.ok) {
    throw new Error(`Ollama returned ${response.status}`);
  }

  const data = await response.json();
  return data.response;
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
    const answer = await askOllama(text);
    pendingMessage.textContent = answer;
    pendingMessage.classList.remove("pending");
  } catch (error) {
    pendingMessage.textContent =
      error.message || "Something went wrong. Please try again.";
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