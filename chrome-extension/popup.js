const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  const userMsg = document.createElement("div");
  userMsg.className = "user";
  userMsg.textContent = "You: " + message;
  chatBox.appendChild(userMsg);
  userInput.value = "";

  try {
    const response = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    const botMsg = document.createElement("div");
    botMsg.className = "bot";
    botMsg.textContent = "Bot: " + data.reply;
    chatBox.appendChild(botMsg);
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (err) {
    const errorMsg = document.createElement("div");
    errorMsg.className = "bot";
    errorMsg.textContent = "Error: Could not connect to backend.";
    chatBox.appendChild(errorMsg);
  }
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
