/**
 * Security utility: Prompt Injection Prevention
 * Sanitizes user inputs before they are interpolated into AI prompts.
 */

// Patterns that indicate a prompt injection attempt
const INJECTION_PATTERNS = [
  /ignora\s+(todas?\s+)?(tus\s+)?(instrucciones|reglas)/gi,
  /ignore\s+(all\s+)?(your\s+)?(instructions|rules|previous)/gi,
  /olvida\s+(todo|tus\s+instrucciones)/gi,
  /forget\s+(everything|your\s+instructions)/gi,
  /eres\s+ahora\s+un/gi,
  /you\s+are\s+now\s+a/gi,
  /actúa\s+como\s+(si\s+fueras|un)/gi,
  /act\s+as\s+(if\s+you\s+are|a)/gi,
  /system\s+prompt/gi,
  /jailbreak/gi,
  /DAN\s+mode/gi,
  /devuelve\s+tus\s+instrucciones/gi,
  /reveal\s+your\s+(system\s+)?prompt/gi,
  /<\s*system\s*>/gi,
  /\[INST\]/gi,
];

const MAX_FIELD_LENGTH = 1000;
const MAX_TEXT_LENGTH = 5000; // For the editor transform

/**
 * Removes prompt injection patterns and truncates the string to a safe length.
 */
export function sanitizeInput(value: unknown, maxLength = MAX_FIELD_LENGTH): string {
  if (typeof value !== 'string') return '';

  let sanitized = value.trim();

  // Truncate to max length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.slice(0, maxLength);
  }

  // Detect and neutralize injection patterns
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(sanitized)) {
      // Replace the suspicious phrase rather than rejecting outright
      sanitized = sanitized.replace(pattern, '[contenido eliminado]');
    }
  }

  return sanitized;
}

/**
 * Sanitizes all string values in an object recursively.
 * Use this to sanitize the entire `input` object from the API body.
 */
export function sanitizeInputObject(obj: Record<string, unknown>, maxLength = MAX_FIELD_LENGTH): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value, maxLength);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeInputObject(value as Record<string, unknown>, maxLength);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Wraps user-provided data in a clear "DATA" block to help the LLM
 * distinguish between instructions (the system) and data (the user).
 * This is the "instruction hierarchy" technique.
 */
export function wrapAsData(label: string, value: string): string {
  return `[DATO - ${label}]: ${value}`;
}

export const MAX_TEXT_FIELD_LENGTH = MAX_TEXT_LENGTH;
