import fs from 'fs/promises';
import path from 'path';

/**
 * Clase que gestiona las habilidades del Agente Content Creator
 */
export class CreatorAgent {
  private static readonly BASE_PATH = path.join(process.cwd(), 'src/lib/agents/content_creator');

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
   * Prepara el prompt completo para YouTube Script
   */
  static async prepareYouTubeScriptPrompt(input: any, context: any): Promise<{ system: string; user: string }> {
    const system = "Eres un creador de contenido profesional."; // Podemos ajustarlo o crear un persona.md si lo desean
    
    // Preparar el contexto del proyecto (memoria)
    const contextObj = {
      ...context,
      aiKnowledge: context.aiKnowledge || {}
    };
    const projectContext = JSON.stringify(contextObj, null, 2);

    const variables = {
      projectContext: projectContext,
      videoTopic: input.videoTopic || 'N/A',
      videoStyle: input.videoStyle || 'N/A',
      targetDuration: input.targetDuration || 'N/A',
      callToAction: input.callToAction || 'N/A'
    };
    
    const user = await this.getFileContent('youtube_script_skill.md', variables);
    return { system, user };
  }

  /**
   * Prepara el prompt completo para YouTube SEO
   */
  static async prepareYouTubeSEOPrompt(input: any, context: any): Promise<{ system: string; user: string }> {
    const system = "Eres un creador de contenido profesional especializado en crecimiento de YouTube.";
    
    // Preparar el contexto del proyecto (memoria)
    const contextObj = {
      ...context,
      aiKnowledge: context.aiKnowledge || {}
    };
    const projectContext = JSON.stringify(contextObj, null, 2);

    const variables = {
      projectContext: projectContext,
      mainKeyword: input.mainKeyword || 'N/A',
      rawSummary: input.rawSummary || 'N/A'
    };
    
    const user = await this.getFileContent('youtube_seo_skill.md', variables);
    return { system, user };
  }
}
