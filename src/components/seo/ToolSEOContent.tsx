import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SEOData {
  hero: {
    title: string;
    description: string;
  };
  benefitsTitle?: string;
  useCasesTitle?: string;
  faqsTitle?: string;
  benefits: {
    title: string;
    description: string;
    icon: string;
  }[];
  useCases: {
    title: string;
    description: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

interface ToolSEOContentProps {
  data: SEOData;
  className?: string;
}

const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) return <LucideIcons.Check className={className} />;
  return <IconComponent className={className} />;
};

export function ToolSEOContent({ data, className }: ToolSEOContentProps) {
  return (
    <div className={cn("w-full max-w-5xl mx-auto py-16 space-y-24", className)}>
      
      {/* 1. Hero / Intro */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          {data.hero.title}
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {data.hero.description}
        </p>
      </section>

      {/* 2. Benefits Grid */}
      <section className="space-y-8">
        <h3 className="text-2xl font-bold text-center">{data.benefitsTitle || 'Beneficios y Características Clave'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.benefits.map((benefit, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur border-primary/10 hover:border-primary/30 transition-colors shadow-sm">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <DynamicIcon name={benefit.icon} className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 3. Use Cases */}
      <section className="bg-primary/5 rounded-3xl p-8 md:p-12">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-10">{data.useCasesTitle || 'Casos de Uso Ideales'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.useCases.map((useCase, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <h4 className="font-bold text-lg">{useCase.title}</h4>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed pl-4 border-l border-primary/20">
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FAQs */}
      <section className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold">{data.faqsTitle || 'Preguntas Frecuentes'}</h3>
          <p className="text-muted-foreground">Todo lo que necesitas saber sobre esta herramienta.</p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {data.faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-primary/10">
              <AccordionTrigger className="text-left font-semibold hover:text-primary transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

    </div>
  );
}
