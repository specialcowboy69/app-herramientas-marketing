import fs from 'fs/promises';
import path from 'path';

/**
 * Clase que gestiona las habilidades del Agente SEO
 */
export class SEOSpecialistAgent {
  private static readonly BASE_PATH = path.join(process.cwd(), 'src/lib/agents/seo_specialist');

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
   * Prepara el prompt completo para el SEO Brief
   */
  static async prepareSEOBriefPrompt(input: any, context: any): Promise<{ system: string; user: string }> {
    const system = await this.getFileContent('seo_persona.md');
    const { customerAvatar, painPoints } = this.stringifyKnowledge(context);

    const variables = {
      primaryKeyword: input.primaryKeyword || 'N/A',
      secondaryKeywords: input.secondaryKeywords || 'N/A',
      searchIntent: input.searchIntent || 'N/A',
      pageType: input.pageType || 'N/A',
      language: context.language || 'es',
      customerAvatar: customerAvatar || 'No proporcionado',
      painPoints: painPoints || 'No proporcionado'
    };
    const user = await this.getFileContent('seo_brief_skill.md', variables);
    return { system, user };
  }

  /**
   * Prepara el prompt completo para el Blog Toolkit
   */
  static async prepareBlogToolkitPrompt(input: any, context: any): Promise<{ system: string; user: string }> {
    const system = await this.getFileContent('seo_persona.md');
    const { customerAvatar, painPoints } = this.stringifyKnowledge(context);

    const variables = {
      topic: input.topic || 'N/A',
      primaryKeyword: input.primaryKeyword || 'N/A',
      audience: input.audience || context.targetAudience || 'N/A',
      tone: input.tone || context.brandTone || 'profesional',
      articleGoal: input.articleGoal || 'N/A',
      desiredLength: input.desiredLength || 'N/A',
      language: context.language || 'es',
      customerAvatar: customerAvatar || 'No proporcionado',
      painPoints: painPoints || 'No proporcionado'
    };
    const user = await this.getFileContent('blog_toolkit_skill.md', variables);
    return { system, user };
  }
}
