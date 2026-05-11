import fs from 'fs/promises';
import path from 'path';

/**
 * Clase que gestiona las habilidades del Agente Copywriter
 */
export class CopywriterAgent {
  private static readonly BASE_PATH = path.join(process.cwd(), 'src/lib/agents/copywriter');

  /**
   * Lee un archivo markdown y reemplaza las variables en formato {{variable}}
   */
  private static async getFileContent(filename: string, variables: Record<string, string> = {}): Promise<string> {
    const filePath = path.join(this.BASE_PATH, filename);
    let content = await fs.readFile(filePath, 'utf-8');

    // Reemplazar todas las ocurrencias de {{key}} con el valor correspondiente
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      content = content.replace(regex, value);
    }

    return content;
  }

  /**
   * Procesa el objeto de conocimiento de IA para convertirlo en strings legibles por el prompt
   */
  private static stringifyKnowledge(context: any): { customerAvatar: string, painPoints: string } {
    const knowledge = context.aiKnowledge || {};
    
    const stringify = (val: any) => {
      if (!val) return '';
      return typeof val === 'string' ? val : JSON.stringify(val, null, 2);
    };

    return {
      customerAvatar: stringify(knowledge.lastAvatar),
      painPoints: stringify(knowledge.painPoints)
    };
  }

  /**
   * Prepara el prompt completo para el generador de anuncios
   */
  static async prepareAdsPrompt(input: any, context: any): Promise<{ system: string; user: string }> {
    const system = await this.getFileContent('copywriter_persona.md');
    const { customerAvatar, painPoints } = this.stringifyKnowledge(context);

    const variables = {
      platform: input.platform || 'N/A',
      productOrService: input.productOrService || context.productName || 'N/A',
      targetAudience: input.targetAudience || context.targetAudience || 'N/A',
      offer: input.offer || 'N/A',
      mainProblem: input.mainProblem || 'N/A',
      cta: input.cta || 'N/A',
      tone: input.tone || context.brandTone || 'persuasivo',
      language: context.language || 'es',
      customerAvatar: customerAvatar || 'No proporcionado',
      painPoints: painPoints || 'No proporcionado'
    };

    const user = await this.getFileContent('ads_skill.md', variables);
    return { system, user };
  }

  /**
   * Prepara el prompt completo para CTA Generator
   */
  static async prepareCTAPrompt(input: any, context: any): Promise<{ system: string; user: string }> {
    const system = await this.getFileContent('copywriter_persona.md');
    const { customerAvatar, painPoints } = this.stringifyKnowledge(context);

    const variables = {
      goal: input.goal || 'N/A',
      tone: input.tone || context.brandTone || 'persuasivo',
      channel: input.channel || 'N/A',
      urgencyLevel: input.urgencyLevel || 'N/A',
      language: context.language || 'es',
      customerAvatar: customerAvatar || 'No proporcionado',
      painPoints: painPoints || 'No proporcionado'
    };
    const user = await this.getFileContent('cta_skill.md', variables);
    return { system, user };
  }

  /**
   * Prepara el prompt completo para Naming & Slogan
   */
  static async prepareNamingPrompt(input: any, context: any): Promise<{ system: string; user: string }> {
    const system = await this.getFileContent('copywriter_persona.md');
    const variables = {
      businessType: input.businessType || 'N/A',
      brandTone: input.brandTone || 'N/A',
      keywords: input.keywords || 'N/A',
      style: input.style || 'N/A',
      language: context.language || 'es'
    };
    const user = await this.getFileContent('naming_slogan_skill.md', variables);
    return { system, user };
  }

  /**
   * Prepara el prompt completo para Product Description
   */
  static async prepareProductDescriptionPrompt(input: any, context: any): Promise<{ system: string; user: string }> {
    const system = await this.getFileContent('copywriter_persona.md');
    const { customerAvatar, painPoints } = this.stringifyKnowledge(context);

    const variables = {
      productName: input.productName || context.productName || 'N/A',
      category: input.category || 'N/A',
      features: input.features || 'N/A',
      benefits: input.benefits || 'N/A',
      targetAudience: input.targetAudience || context.targetAudience || 'N/A',
      tone: input.tone || context.brandTone || 'profesional',
      language: context.language || 'es',
      customerAvatar: customerAvatar || 'No proporcionado',
      painPoints: painPoints || 'No proporcionado'
    };
    const user = await this.getFileContent('product_description_skill.md', variables);
    return { system, user };
  }

  /**
   * Prepara el prompt completo para Amazon Product
   */
  static async prepareAmazonProductPrompt(input: any, context: any): Promise<{ system: string; user: string }> {
    const system = await this.getFileContent('copywriter_persona.md');
    
    // Preparar el contexto del proyecto (memoria)
    const contextObj = {
      ...context,
      aiKnowledge: context.aiKnowledge || {}
    };
    const projectContext = JSON.stringify(contextObj, null, 2);

    const variables = {
      projectContext: projectContext,
      productName: input.productName || 'N/A',
      keyFeatures: input.keyFeatures || 'N/A',
      mainBenefit: input.mainBenefit || 'N/A',
      targetPainPoint: input.targetPainPoint || 'N/A'
    };
    
    const user = await this.getFileContent('amazon_product_skill.md', variables);
    return { system, user };
  }

  /**
   * Prepara el prompt completo para Framework PAS
   */
  static async prepareFrameworkPASPrompt(input: any, context: any): Promise<{ system: string; user: string }> {
    const system = await this.getFileContent('copywriter_persona.md');
    
    // Preparar el contexto del proyecto (memoria)
    const contextObj = {
      ...context,
      aiKnowledge: context.aiKnowledge || {}
    };
    const projectContext = JSON.stringify(contextObj, null, 2);

    const variables = {
      projectContext: projectContext,
      topic: input.topic || 'N/A',
      angle: input.angle || 'N/A'
    };
    
    const user = await this.getFileContent('framework_pas_skill.md', variables);
    return { system, user };
  }
}
