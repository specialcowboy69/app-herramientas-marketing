import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const getModel = (modelName: string = "gemini-2.5-flash") => {
  return genAI.getGenerativeModel({ model: modelName });
};

export const generateJSON = async (prompt: string, modelName: string = "gemini-2.5-flash") => {
  const model = getModel(modelName);
  
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const response = result.response;
  return JSON.parse(response.text());
};

export const generateText = async (prompt: string, modelName: string = "gemini-2.5-flash") => {
  const model = getModel(modelName);
  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
};
