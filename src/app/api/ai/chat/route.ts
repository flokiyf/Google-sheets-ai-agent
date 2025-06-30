import { NextRequest, NextResponse } from 'next/server'
import { openaiAgent } from '@/lib/openai-agent'

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message requis' },
        { status: 400 }
      )
    }

    const response = await openaiAgent.chat(message, context)
    return NextResponse.json({ response })
  } catch (error) {
    console.error('Erreur chat IA:', error)
    return NextResponse.json(
      { error: 'Erreur lors du chat avec l\'IA' },
      { status: 500 }
    )
  }
} 