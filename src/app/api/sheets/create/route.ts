import { NextRequest, NextResponse } from 'next/server'
import { googleSheetsService } from '@/lib/google-sheets'

export async function POST(request: NextRequest) {
  try {
    const { title, sheetNames } = await request.json()

    if (!title) {
      return NextResponse.json(
        { error: 'Le titre est requis' },
        { status: 400 }
      )
    }

    const spreadsheet = await googleSheetsService.createSpreadsheet(
      title,
      sheetNames || ['Sheet1']
    )

    return NextResponse.json(spreadsheet)
  } catch (error) {
    console.error('Erreur création spreadsheet:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la feuille' },
      { status: 500 }
    )
  }
} 