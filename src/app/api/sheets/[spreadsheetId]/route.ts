import { NextRequest, NextResponse } from 'next/server'
import { googleSheetsService } from '@/lib/google-sheets'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ spreadsheetId: string }> }
) {
  try {
    const { spreadsheetId } = await params

    if (!spreadsheetId) {
      return NextResponse.json(
        { error: 'ID de spreadsheet requis' },
        { status: 400 }
      )
    }

    const spreadsheet = await googleSheetsService.getSpreadsheetInfo(spreadsheetId)
    return NextResponse.json(spreadsheet)
  } catch (error) {
    console.error('Erreur récupération spreadsheet:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la feuille' },
      { status: 500 }
    )
  }
} 