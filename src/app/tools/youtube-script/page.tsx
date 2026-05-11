"use client";

import { ToolView } from "@/components/tools/ToolView";

export default function YouTubeScriptPage() {
  return (
    <ToolView
      title="Guionista de YouTube (Retención Alta)"
      description="Crea guiones y escaletas estructuradas específicamente para evitar caídas de retención de audiencia en YouTube."
      toolName="Guionista de YouTube"
      toolSlug="youtube-script"
      initialValues={{
        videoTopic: "",
        videoStyle: "Educativo",
        targetDuration: "",
        callToAction: ""
      }}
      fields={[
        {
          name: "videoTopic",
          label: "Tema del Video",
          type: "text",
          placeholder: "Ej: Cómo empezar a invertir en bolsa desde cero",
          required: true,
        },
        {
          name: "videoStyle",
          label: "Estilo",
          type: "select",
          options: ["Educativo", "Entretenimiento", "Vlog", "Documental", "Tutorial Rápido"],
          required: true,
        },
        {
          name: "targetDuration",
          label: "Duración Objetivo",
          type: "text",
          placeholder: "Ej: 8-10 minutos",
          required: true,
        },
        {
          name: "callToAction",
          label: "Call to Action (CTA)",
          type: "text",
          placeholder: "Ej: Suscríbete y descarga la guía gratuita",
          required: true,
        }
      ]}
    />
  );
}
