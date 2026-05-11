"use client";

import { ToolView } from "@/components/tools/ToolView";

export default function FrameworkPASPage() {
  return (
    <ToolView
      title="Framework PAS (Problema, Agitación, Solución)"
      description="Genera copy persuasivo utilizando el framework PAS para maximizar la conversión atacando los puntos de dolor de tu cliente."
      toolName="Framework PAS"
      toolSlug="framework-pas"
      initialValues={{
        topic: "",
        angle: ""
      }}
      fields={[
        {
          name: "topic",
          label: "Tema",
          type: "text",
          placeholder: "Ej: Curso de Productividad para Emprendedores",
          required: true,
        },
        {
          name: "angle",
          label: "Ángulo",
          type: "textarea",
          placeholder: "Ej: Enfocado en cómo la falta de tiempo destruye sus relaciones personales.",
          required: true,
        }
      ]}
    />
  );
}
