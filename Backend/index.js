const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const app = express();
const PORT = 3000;
const cors = require('cors')
// Middleware to parse JSON
app.use(express.json()); 
//cors
app.use(cors())

// Basic route
app.get('/', (req, res) => {
  res.send('Hello from Node.js backend!');
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/Ai", async (req, res) => {
 try {
   const { prompt } = req.body;
   const result = await model.generateContent(prompt);
   res.send(result.response.text());
 } catch (error) {
   res.send(error)
 }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
