import { NextRequest, NextResponse } from 'next/server'
import { googleSheetsService } from '@/lib/google-sheets'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ spreadsheetId: string }> }
) {
  try {
    const { spreadsheetId } = await params
    const { sheetName, range, values, append } = await request.json()

    if (!spreadsheetId || !sheetName || !values) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      )
    }

    const fullRange = `${sheetName}!${range || 'A1'}`

    if (append) {
      await googleSheetsService.appendSheet(spreadsheetId, fullRange, values)
    } else {
      await googleSheetsService.writeSheet(spreadsheetId, fullRange, values)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur mise à jour données:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des données' },
      { status: 500 }
    )
  }
} 