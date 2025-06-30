import { NextRequest, NextResponse } from 'next/server'
import { googleSheetsService } from '@/lib/google-sheets'

export async function GET(request: NextRequest) {
  try {
    console.log('📋 Récupération de la liste des spreadsheets...')
    
    const spreadsheets = await googleSheetsService.listAllSpreadsheets()
    
    console.log(`✅ ${spreadsheets.length} spreadsheets trouvés`)
    
    return NextResponse.json({
      success: true,
      data: spreadsheets,
      count: spreadsheets.length
    })
  } catch (error: any) {
    console.error('❌ Erreur lors de la récupération des spreadsheets:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Erreur lors de la récupération des spreadsheets'
    }, { status: 500 })
  }
} 