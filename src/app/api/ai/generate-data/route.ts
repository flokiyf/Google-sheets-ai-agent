import { NextRequest, NextResponse } from 'next/server'
import { openaiAgent } from '@/lib/openai-agent'

export async function POST(request: NextRequest) {
  try {
    const { type, rows } = await request.json()

    if (!type) {
      return NextResponse.json(
        { error: 'Type de données requis' },
        { status: 400 }
      )
    }

    const data = await openaiAgent.generateSampleData(type, rows || 10)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erreur génération données:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération des données' },
      { status: 500 }
    )
  }
} 