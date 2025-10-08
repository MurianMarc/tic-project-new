import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
const HF_API_KEY = process.env.HF_API_KEY;
const HF_TOKEN = process.env.HF_TOKEN;


const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true })); //allows to upload a larger image


const HF_KEY = "hhf_ndfkTYzwRFAKoWPMbaYnoctxzhJZiJERWR"; //from hugging face


const HF_MODEL = "mistralai/Mixtral-8x7B-Instruct"; //best "free" model according to google

app.post("/ai-search", async (req, res) => {
  try {
    const { query, lostItems } = req.body;
    const descriptions = lostItems
      .map((item, i) => `Item ${i + 1}: ${item.description}`)
      .join("\n");

    const prompt = `
User is searching for: "${query}"

Here are stored items:
${descriptions}

Return the best matching item number only (e.g. "Item 3").`;

    const hfResponse = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${HF_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    inputs: `User is searching for: "${query}". Compare with items: ${descriptions}. Return best match item number.`,
  }),
});


    if (!response.ok) {
      const text = await response.text();
      console.error("HuggingFace API error:", text);
      return res.status(response.status).send(text);
    }

    const data = await response.json();

    
    const outputText =
      data[0]?.generated_text || data.generated_text || JSON.stringify(data);

    res.json({ result: outputText });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to connect to Hugging Face API" }); //if search req failed
  }
});

app.use(express.static(".")); 

app.listen(5000, () =>
  console.log("✅ Server running on http://localhost:5000")
);
app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) => {
  res.status(204).send(); // i had issues with it that i didnt understand and chatgpt gave me this solution to fix one of the issues
});

