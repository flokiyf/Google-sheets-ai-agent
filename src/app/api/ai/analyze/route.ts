import { NextRequest, NextResponse } from 'next/server'
import { openaiAgent } from '@/lib/openai-agent'

export async function POST(request: NextRequest) {
  try {
    const { spreadsheetId, sheetName } = await request.json()

    if (!spreadsheetId || !sheetName) {
      return NextResponse.json(
        { error: 'ID de spreadsheet et nom de feuille requis' },
        { status: 400 }
      )
    }

    const analysis = await openaiAgent.analyzeSheet(spreadsheetId, sheetName)
    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Erreur analyse IA:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'analyse des données' },
      { status: 500 }
    )
  }
} 