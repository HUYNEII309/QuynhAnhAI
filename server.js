// server.js
// Yêu cầu Node 18+
// Cài: npm install express dotenv cors

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const GOOGLE_KEY = process.env.GOOGLE_API_KEY;

// Kiểm tra key
if (!GOOGLE_KEY) {
  console.error("❌ ERROR: GOOGLE_API_KEY not set in environment");
  process.exit(1);
}

// Lấy __dirname khi dùng ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Phục vụ frontend từ thư mục public
app.use(express.static(path.join(__dirname, "public")));

// Endpoint API chính
app.post("/api/generate", async (req, res) => {
  try {
    const { model = "gemini-2.5-flash", contents } = req.body;

    const body = { contents };
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GOOGLE_KEY}`;

    const apiRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      return res.status(apiRes.status).json(data);
    }

    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server_error", message: err.message });
  }
});

// Bắt tất cả route khác → trả về index.html (dành cho frontend SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
