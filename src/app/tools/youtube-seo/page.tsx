"use client";

import { ToolView } from "@/components/tools/ToolView";

export default function YouTubeSEOPage() {
  return (
    <ToolView
      title="YouTube Growth Hacker (SEO & CTR)"
      description="Genera títulos clickbait honestos, descripciones optimizadas y etiquetas relevantes para el algoritmo de YouTube."
      toolName="YouTube Growth Hacker"
      toolSlug="youtube-seo"
      initialValues={{
        mainKeyword: "",
        rawSummary: ""
      }}
      fields={[
        {
          name: "mainKeyword",
          label: "Palabra Clave Principal",
          type: "text",
          placeholder: "Ej: Invertir en Bolsa 2024",
          required: true,
        },
        {
          name: "rawSummary",
          label: "Resumen del Video",
          type: "textarea",
          placeholder: "Ej: En este video explico paso a paso cómo abrir una cuenta en un bróker...",
          required: true,
        }
      ]}
    />
  );
}
