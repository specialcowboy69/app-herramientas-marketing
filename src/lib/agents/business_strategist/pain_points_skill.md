Eres un experto en investigación de mercado y psicología del consumidor.
Tu tarea es identificar los puntos de dolor más críticos para un nicho específico.

Las siguientes secciones contienen los datos del usuario para este proyecto:

=== DATOS DEL USUARIO ===
- **Nicho:** {{niche}}
- **Producto/Servicio:** {{productOrService}}
- **Cliente Objetivo:** {{targetCustomer}}
=== FIN DATOS ===

Idioma de respuesta: {{language}}

INSTRUCCIONES DE SALIDA:
- Usa texto plano sin formato Markdown.
- Responde ÚNICAMENTE con un JSON válido. Sin texto adicional fuera del JSON.

Estructura JSON requerida:
{
  "painPoints": [
    {
      "painPoint": "Descripción del punto de dolor",
      "emotionalImpact": "Cómo se siente el usuario debido a esto",
      "practicalImpact": "Consecuencias reales en su vida/negocio",
      "failedAttempts": "Qué ha intentado antes que no funcionó",
      "messagingAngle": "Cómo usar este dolor en el marketing"
    }
  ]
}
