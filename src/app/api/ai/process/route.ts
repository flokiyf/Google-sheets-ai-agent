import { NextRequest, NextResponse } from 'next/server'
import { openaiAgent } from '@/lib/openai-agent'

export async function POST(request: NextRequest) {
  try {
    const { prompt, spreadsheetId, sheetName, context } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt requis' },
        { status: 400 }
      )
    }

    const response = await openaiAgent.processRequest({
      prompt,
      spreadsheetId,
      sheetName,
      context
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error('Erreur traitement IA:', error)
    return NextResponse.json(
      { error: 'Erreur lors du traitement de la requête IA' },
      { status: 500 }
    )
  }
} 