import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const getModel = (modelName: string = "gemini-2.5-flash", systemInstruction?: string) => {
  return genAI.getGenerativeModel({ 
    model: modelName,
    systemInstruction: systemInstruction ? { role: "system", parts: [{ text: systemInstruction }] } : undefined
  });
};

export const generateJSON = async (prompt: string, modelName: string = "gemini-2.5-flash", systemInstruction?: string) => {
  // 1. Instanciar el modelo forzando el modo JSON nativo
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: systemInstruction ? { role: "system", parts: [{ text: systemInstruction }] } : undefined,
    generationConfig: {
      responseMimeType: "application/json",
    }
  });

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text();

    // 2. Limpieza de seguridad: A veces la IA añade bloques markdown (```json) incluso en modo JSON
    text = text.replace(/^```json\s*/gi, '').replace(/```\s*$/g, '').trim();

    // 3. Limpieza de caracteres de control invisibles (tabulaciones rotas, etc.) que rompen el parseo
    // Se omite el \n (\x0A) porque el modo JSON de Gemini ya lo escapa correctamente como \\n
    text = text.replace(/[\u0000-\u0009\u000B-\u001F]+/g, "");

    // 4. Parseo seguro
    return JSON.parse(text);
  } catch (error) {
    console.error("Error crítico parseando JSON de Gemini:", error);
    // Enviar un error legible hacia la UI para que el usuario sepa qué ha fallado
    throw new Error("El modelo generó caracteres inválidos. Por favor, intenta regenerar la respuesta.");
  }
};

export const generateText = async (prompt: string, modelName: string = "gemini-2.5-flash") => {
  const model = getModel(modelName);
  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
};
