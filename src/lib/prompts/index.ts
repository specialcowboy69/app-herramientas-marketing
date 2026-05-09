import { sanitizeInput } from '@/lib/security/sanitize';

// Helper: wraps user data in clear DATA blocks to prevent the LLM
// from interpreting user input as system instructions (prompt injection defense).
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const d = (label: string, value: unknown): string =>
  `[DATO - ${label}]: ${sanitizeInput(String(value ?? ''))}`;

/**
 * Los prompts de herramientas han sido migrados a la arquitectura de "Agent Skills"
 * en src/lib/agents/. Este objeto se mantiene vacío para retrocompatibilidad 
 * o futuras herramientas ligeras.
 */
export const TOOL_PROMPTS = {};

/**
 * Prompts de transformación rápida (Legacy)
 */
export const TRANSFORM_PROMPTS = {
  rewrite: (text: string, context: any) => `Reescribe el siguiente texto de forma más profesional y clara, manteniendo el tono ${context.brandTone || 'neutral'}. Texto: ${text}`,
  expand: (text: string, context: any) => `Expande el siguiente texto añadiendo más detalles y profundidad, manteniendo el contexto del proyecto ${context.name}. Texto: ${text}`,
  summarize: (text: string, context: any) => `Resume el siguiente texto manteniendo los puntos clave. Texto: ${text}`,
  professional: (text: string, context: any) => `Cambia el tono del siguiente texto a uno más profesional y corporativo. Texto: ${text}`,
  persuasive: (text: string, context: any) => `Cambia el tono del siguiente texto a uno más persuasivo y orientado a la venta. Texto: ${text}`,
  clearer: (text: string, context: any) => `Haz el siguiente texto más claro y fácil de entender. Texto: ${text}`,
};
