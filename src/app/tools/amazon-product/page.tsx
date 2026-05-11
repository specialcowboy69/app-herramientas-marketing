"use client";

import { ToolView } from "@/components/tools/ToolView";

export default function AmazonProductPage() {
  return (
    <ToolView
      title="Amazon Product Copywriter"
      description="Redacta listados de productos que maximicen la conversión y el posicionamiento orgánico en Amazon."
      toolName="Amazon Product Copywriter"
      toolSlug="amazon-product"
      initialValues={{
        productName: "",
        keyFeatures: "",
        mainBenefit: "",
        targetPainPoint: ""
      }}
      fields={[
        {
          name: "productName",
          label: "Nombre del Producto",
          type: "text",
          placeholder: "Ej: Auriculares Bluetooth NoiseCanceling",
          required: true,
        },
        {
          name: "keyFeatures",
          label: "Características Técnicas",
          type: "textarea",
          placeholder: "Ej: Batería 40h, Carga rápida, Cancelación activa de ruido",
          required: true,
        },
        {
          name: "mainBenefit",
          label: "Beneficio Principal",
          type: "text",
          placeholder: "Ej: Disfruta de tu música sin distracciones externas.",
          required: true,
        },
        {
          name: "targetPainPoint",
          label: "Dolor que Resuelve",
          type: "text",
          placeholder: "Ej: Molestia por ruidos de fondo en la oficina o durante viajes.",
          required: true,
        }
      ]}
    />
  );
}
