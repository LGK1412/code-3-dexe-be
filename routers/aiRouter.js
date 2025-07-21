const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function translateCode(language, codeContext) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `Translate the following code to ${language}. Provide only the translated code without any explanations:\n\n${codeContext}`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error(`Error translating to ${language}:`, error);
    throw new Error(`Failed to translate code to ${language}`);
  }
}

router.post("/translate", async (req, res) => {
  const { language, codeContext } = req.body;

  if (!language || !codeContext) {
    return res
      .status(400)
      .json({ error: "Language and code context are required" });
  }

  try {
    const translatedCode = await translateCode(language, codeContext);
    res.json({ translatedCode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
