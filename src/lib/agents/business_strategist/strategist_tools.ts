import fs from 'fs/promises';
import path from 'path';

/**
 * Clase que gestiona las habilidades del Agente Estratega de Negocios
 */
export class BusinessStrategistAgent {
  private static readonly BASE_PATH = path.join(process.cwd(), 'src/lib/agents/business_strategist');

  /**
   * Lee un archivo markdown y reemplaza las variables en formato {{variable}}
   */
  private static async getFileContent(filename: string, variables: Record<string, string> = {}): Promise<string> {
    const filePath = path.join(this.BASE_PATH, filename);
    let content = await fs.readFile(filePath, 'utf-8');

    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      content = content.replace(regex, value);
    }

    return content;
  }

  /**
   * Prepara el prompt completo para Business Idea
   */
  static async prepareBusinessIdeaPrompt(input: any, context: any): Promise<{ system: string; user: string }> {
    const system = await this.getFileContent('strategist_persona.md');
    const variables = {
      interests: input.interests || 'N/A',
      skills: input.skills || 'N/A',
      experience: input.experience || 'N/A',
      targetAudience: input.targetAudience || 'N/A',
      problemsToSolve: input.problemsToSolve || 'N/A',
      businessType: input.businessType || 'N/A',
      projectDescription: context.description || 'N/A',
      language: context.language || 'es'
    };
    const user = await this.getFileContent('business_idea_skill.md', variables);
    return { system, user };
  }

  /**
   * Prepara el prompt completo para Customer Avatar
   */
  static async prepareCustomerAvatarPrompt(input: any, context: any): Promise<{ system: string; user: string }> {
    const system = await this.getFileContent('strategist_persona.md');
    const variables = {
      productOrService: input.productOrService || 'N/A',
      niche: input.niche || 'N/A',
      customerType: input.customerType || 'N/A',
      mainProblem: input.mainProblem || 'N/A',
      awarenessLevel: input.awarenessLevel || 'N/A',
      projectDescription: context.description || 'N/A',
      language: context.language || 'es'
    };
    const user = await this.getFileContent('customer_avatar_skill.md', variables);
    return { system, user };
  }

  /**
   * Prepara el prompt completo para Pain Points
   */
  static async preparePainPointsPrompt(input: any, context: any): Promise<{ system: string; user: string }> {
    const system = await this.getFileContent('strategist_persona.md');
    const variables = {
      niche: input.niche || 'N/A',
      productOrService: input.productOrService || 'N/A',
      targetCustomer: input.targetCustomer || 'N/A',
      language: context.language || 'es'
    };
    const user = await this.getFileContent('pain_points_skill.md', variables);
    return { system, user };
  }
}
