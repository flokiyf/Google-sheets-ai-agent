import OpenAI from 'openai'
import { googleSheetsService } from './google-sheets'

// Types pour l'agent OpenAI
export interface AIRequest {
  prompt: string
  spreadsheetId?: string
  sheetName?: string
  context?: string
}

export interface AIResponse {
  response: string
  action?: 'create' | 'read' | 'write' | 'analyze' | 'search' | 'format'
  data?: any
  suggestions?: string[]
}

export interface SheetAnalysis {
  summary: string
  insights: string[]
  recommendations: string[]
  dataTypes: { [column: string]: string }
  statistics?: { [key: string]: any }
}

class OpenAIAgent {
  private openai: OpenAI

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build'
    })
  }

  // Analyser une requête utilisateur et déterminer l'action
  async processRequest(request: AIRequest): Promise<AIResponse> {
    try {
      const systemPrompt = `Tu es un assistant spécialisé dans Google Sheets. Tu peux :
1. Créer des feuilles de calcul et analyser des données
2. Lire et écrire des données dans les feuilles
3. Effectuer des analyses et donner des insights
4. Rechercher des informations spécifiques
5. Suggérer des améliorations et des formules

Réponds toujours en JSON avec cette structure :
{
  "response": "réponse en français",
  "action": "create|read|write|analyze|search|format",
  "data": {...},
  "suggestions": ["suggestion1", "suggestion2"]
}

Contexte actuel: ${request.context || 'Aucun contexte'}
${request.spreadsheetId ? `Feuille actuelle: ${request.spreadsheetId}` : ''}
${request.sheetName ? `Onglet: ${request.sheetName}` : ''}`

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: request.prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })

      const responseText = completion.choices[0].message.content
      
      try {
        return JSON.parse(responseText || '{}')
      } catch {
        return {
          response: responseText || 'Erreur dans la réponse',
          action: 'read'
        }
      }
    } catch (error) {
      console.error('Erreur OpenAI:', error)
      return {
        response: 'Désolé, je ne peux pas traiter votre demande pour le moment.',
        action: 'read'
      }
    }
  }

  // Analyser les données d'une feuille
  async analyzeSheet(spreadsheetId: string, sheetName: string = 'Sheet1'): Promise<SheetAnalysis> {
    try {
      // Lire les données de la feuille
      const data = await googleSheetsService.readSheet(spreadsheetId, `${sheetName}!A:Z`)
      
      if (data.length === 0) {
        return {
          summary: 'La feuille est vide',
          insights: ['Aucune donnée à analyser'],
          recommendations: ['Ajoutez des données pour commencer l\'analyse'],
          dataTypes: {}
        }
      }

      const headers = data[0] || []
      const rows = data.slice(1)

      // Analyser avec OpenAI
      const analysisPrompt = `Analyse ces données de Google Sheets :

En-têtes: ${headers.join(', ')}
Nombre de lignes: ${rows.length}
Échantillon de données (5 premières lignes):
${rows.slice(0, 5).map(row => row.join(' | ')).join('\n')}

Fournis une analyse complète en JSON avec cette structure :
{
  "summary": "résumé des données",
  "insights": ["insight1", "insight2"],
  "recommendations": ["recommandation1", "recommandation2"],
  "dataTypes": {"colonne1": "type", "colonne2": "type"},
  "statistics": {"moyenne": 0, "total": 0}
}`

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'user', content: analysisPrompt }
        ],
        temperature: 0.3,
        max_tokens: 1500
      })

      const responseText = completion.choices[0].message.content
      
      try {
        return JSON.parse(responseText || '{}')
      } catch {
        return {
          summary: 'Analyse effectuée mais format de réponse invalide',
          insights: ['Données trouvées dans la feuille'],
          recommendations: ['Vérifiez le format des données'],
          dataTypes: {}
        }
      }
    } catch (error) {
      console.error('Erreur analyse sheet:', error)
      return {
        summary: 'Erreur lors de l\'analyse',
        insights: ['Impossible d\'accéder aux données'],
        recommendations: ['Vérifiez les permissions de la feuille'],
        dataTypes: {}
      }
    }
  }

  // Générer des données d'exemple
  async generateSampleData(type: string, rows: number = 10): Promise<string[][]> {
    try {
      const prompt = `Génère ${rows} lignes de données d'exemple pour un tableau de type "${type}".
      
Retourne uniquement un tableau JSON avec en-têtes et données, format :
[
  ["En-tête1", "En-tête2", "En-tête3"],
  ["donnée1", "donnée2", "donnée3"],
  ...
]

Types disponibles: ventes, employés, produits, finances, inventaire, clients, projets`

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 2000
      })

      const responseText = completion.choices[0].message.content
      
      try {
        return JSON.parse(responseText || '[]')
      } catch {
        // Données par défaut si erreur de parsing
        return [
          ['Nom', 'Valeur', 'Date'],
          ['Exemple 1', '100', new Date().toLocaleDateString()],
          ['Exemple 2', '200', new Date().toLocaleDateString()]
        ]
      }
    } catch (error) {
      console.error('Erreur génération données:', error)
      return [
        ['Nom', 'Valeur', 'Date'],
        ['Exemple 1', '100', new Date().toLocaleDateString()],
        ['Exemple 2', '200', new Date().toLocaleDateString()]
      ]
    }
  }

  // Suggérer des formules Excel/Google Sheets
  async suggestFormulas(context: string, data?: string[][]): Promise<string[]> {
    try {
      const prompt = `Basé sur ce contexte : "${context}"
      ${data ? `Et ces données d'exemple : ${JSON.stringify(data.slice(0, 3))}` : ''}
      
Suggère 5 formules Google Sheets utiles avec explications.
Format : ["=FORMULE() - Explication", "=FORMULE2() - Explication"]`

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 800
      })

      const responseText = completion.choices[0].message.content
      
      try {
        return JSON.parse(responseText || '[]')
      } catch {
        return [
          '=SUM(A:A) - Somme de la colonne A',
          '=AVERAGE(B:B) - Moyenne de la colonne B',
          '=COUNT(C:C) - Compte les cellules non vides',
          '=MAX(D:D) - Valeur maximale',
          '=MIN(E:E) - Valeur minimale'
        ]
      }
    } catch (error) {
      console.error('Erreur suggestions formules:', error)
      return [
        '=SUM(A:A) - Somme de la colonne A',
        '=AVERAGE(B:B) - Moyenne de la colonne B'
      ]
    }
  }

  // Convertir langage naturel en formule
  async naturalLanguageToFormula(description: string): Promise<string> {
    try {
      const prompt = `Convertis cette description en formule Google Sheets :
"${description}"

Réponds uniquement avec la formule, exemple : =SUM(A1:A10)`

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 200
      })

      return completion.choices[0].message.content?.trim() || '=SUM(A:A)'
    } catch (error) {
      console.error('Erreur conversion formule:', error)
      return '=SUM(A:A)'
    }
  }

  // Chat conversationnel avec contexte
  async chat(message: string, context?: any): Promise<string> {
    try {
      const systemPrompt = `Tu es un assistant expert en Google Sheets. Réponds de manière conversationnelle et utile.
      
Contexte actuel: ${JSON.stringify(context || {})}`

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
      })

      return completion.choices[0].message.content || 'Je ne peux pas répondre pour le moment.'
    } catch (error) {
      console.error('Erreur chat:', error)
      return 'Désolé, je rencontre des difficultés techniques.'
    }
  }
}

export const openaiAgent = new OpenAIAgent() 