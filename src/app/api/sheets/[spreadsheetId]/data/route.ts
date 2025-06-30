import { NextRequest, NextResponse } from 'next/server'
import { googleSheetsService } from '@/lib/google-sheets'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ spreadsheetId: string }> }
) {
  try {
    const { spreadsheetId } = await params
    const { searchParams } = new URL(request.url)
    const sheetName = searchParams.get('sheet') || 'Sheet1'
    const range = searchParams.get('range') || 'A:Z'

    if (!spreadsheetId) {
      return NextResponse.json(
        { error: 'ID de spreadsheet requis' },
        { status: 400 }
      )
    }

    const data = await googleSheetsService.readSheet(
      spreadsheetId,
      `${sheetName}!${range}`
    )

    return NextResponse.json(data)
  } catch (error) {
    console.error('Erreur lecture données:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la lecture des données' },
      { status: 500 }
    )
  }
} 