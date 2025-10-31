const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

const messages = [];

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function addMessage(role, content) {
  const div = document.createElement("div");
  div.classList.add("message");

  const avatar = document.createElement("img");
  avatar.src = role === "user" ? "https://i.imgur.com/VxH6lMP.png" : "https://i.imgur.com/B9Y1I4z.png";

  const text = document.createElement("div");
  text.classList.add(role === "user" ? "user-msg" : "bot-msg");
  text.textContent = content;

  div.appendChild(avatar);
  div.appendChild(text);
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const userText = input.value.trim();
  if (!userText) return;

  addMessage("user", userText);
  input.value = "";

  addMessage("bot", "Đang gõ...");

  messages.push({ role: "user", content: userText });

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  const data = await res.json();
  const botReply = data.choices?.[0]?.message?.content || "Lỗi khi phản hồi.";
  messages.push({ role: "assistant", content: botReply });

  // Xóa "Đang gõ..." và thêm nội dung thật
  chatBox.lastChild.remove();
  addMessage("bot", botReply);
}
