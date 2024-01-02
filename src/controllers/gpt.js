import OpenAI from "openai";
import dotenv from "dotenv";
import { countSyllables } from "./syllableCounter.js";
import fs from "fs";

dotenv.config({ path: "./.env" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const gpt = async (req, res) => {
  try {
    const message = req.body;

    const completion = await openai.chat.completions.create({
      messages: message,
      model: "gpt-3.5-turbo-16k-0613",
      temperature: 0,
      // max_tokens: 2061,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    res.status(200).json({
      text: completion.choices[0].message.content.toString(),
      // syllable: completion.choices[0].message.content.toString(),
      length: completion.choices[0].message.content.toString().length,
    });
  } catch (error) {
    res.status(500).json({ modelo: "Error en modelo GPT", error });
  }
};
