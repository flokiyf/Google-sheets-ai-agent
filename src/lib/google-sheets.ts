import { google } from 'googleapis'
import { JWT } from 'google-auth-library'

export interface SpreadsheetInfo {
  spreadsheetId: string
  title: string
  sheets: SheetInfo[]
  createdTime: string
  modifiedTime: string
}

export interface SheetInfo {
  sheetId: number
  title: string
  index: number
  sheetType: string
  gridProperties: {
    rowCount: number
    columnCount: number
  }
}

export interface CellData {
  row: number
  col: number
  value: string
  formula?: string
}

class GoogleSheetsService {
  private auth: JWT | null = null
  private sheets: any = null

  constructor() {
    this.initializeAuth()
  }

  private initializeAuth() {
    try {
      // Configuration avec les variables d'environnement
      const credentials = {
        type: 'service_account',
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.GOOGLE_CLIENT_EMAIL}`
      }

      this.auth = new JWT({
        email: credentials.client_email,
        key: credentials.private_key,
        scopes: [
          'https://www.googleapis.com/auth/spreadsheets',
          'https://www.googleapis.com/auth/drive.file'
        ]
      })

      this.sheets = google.sheets({ version: 'v4', auth: this.auth })
    } catch (error) {
      console.error('Erreur initialisation Google Sheets:', error)
      throw new Error('Configuration Google Sheets invalide')
    }
  }

  // Créer une nouvelle feuille de calcul
  async createSpreadsheet(title: string, sheetNames: string[] = ['Sheet1']): Promise<SpreadsheetInfo> {
    try {
      const response = await this.sheets.spreadsheets.create({
        requestBody: {
          properties: {
            title: title
          },
          sheets: sheetNames.map((name, index) => ({
            properties: {
              sheetId: index,
              title: name,
              index: index,
              sheetType: 'GRID',
              gridProperties: {
                rowCount: 1000,
                columnCount: 26
              }
            }
          }))
        }
      })

      const spreadsheet = response.data
      return {
        spreadsheetId: spreadsheet.spreadsheetId!,
        title: spreadsheet.properties!.title!,
        sheets: spreadsheet.sheets!.map((sheet: any) => ({
          sheetId: sheet.properties!.sheetId!,
          title: sheet.properties!.title!,
          index: sheet.properties!.index!,
          sheetType: sheet.properties!.sheetType!,
          gridProperties: {
            rowCount: sheet.properties!.gridProperties!.rowCount!,
            columnCount: sheet.properties!.gridProperties!.columnCount!
          }
        })),
        createdTime: new Date().toISOString(),
        modifiedTime: new Date().toISOString()
      }
    } catch (error) {
      console.error('Erreur création spreadsheet:', error)
      throw new Error('Impossible de créer la feuille de calcul')
    }
  }

  // Lire les données d'une feuille
  async readSheet(spreadsheetId: string, range: string): Promise<string[][]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range
      })

      return response.data.values || []
    } catch (error) {
      console.error('Erreur lecture sheet:', error)
      throw new Error('Impossible de lire la feuille')
    }
  }

  // Écrire des données dans une feuille
  async writeSheet(spreadsheetId: string, range: string, values: string[][]): Promise<void> {
    try {
      await this.sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        requestBody: {
          values
        }
      })
    } catch (error) {
      console.error('Erreur écriture sheet:', error)
      throw new Error('Impossible d\'écrire dans la feuille')
    }
  }

  // Ajouter des données à la fin d'une feuille
  async appendSheet(spreadsheetId: string, range: string, values: string[][]): Promise<void> {
    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        requestBody: {
          values
        }
      })
    } catch (error) {
      console.error('Erreur ajout sheet:', error)
      throw new Error('Impossible d\'ajouter les données')
    }
  }

  // Obtenir les informations d'une feuille de calcul
  async getSpreadsheetInfo(spreadsheetId: string): Promise<SpreadsheetInfo> {
    try {
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId
      })

      const spreadsheet = response.data
      return {
        spreadsheetId: spreadsheet.spreadsheetId!,
        title: spreadsheet.properties!.title!,
        sheets: spreadsheet.sheets!.map((sheet: any) => ({
          sheetId: sheet.properties!.sheetId!,
          title: sheet.properties!.title!,
          index: sheet.properties!.index!,
          sheetType: sheet.properties!.sheetType!,
          gridProperties: {
            rowCount: sheet.properties!.gridProperties!.rowCount!,
            columnCount: sheet.properties!.gridProperties!.columnCount!
          }
        })),
        createdTime: spreadsheet.properties!.createdTime || new Date().toISOString(),
        modifiedTime: spreadsheet.properties!.modifiedTime || new Date().toISOString()
      }
    } catch (error) {
      console.error('Erreur info spreadsheet:', error)
      throw new Error('Impossible de récupérer les informations')
    }
  }

  // Rechercher dans une feuille
  async searchInSheet(spreadsheetId: string, searchTerm: string): Promise<CellData[]> {
    try {
      // Lire toutes les données de la feuille
      const allData = await this.readSheet(spreadsheetId, 'A:Z')
      const results: CellData[] = []

      allData.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (cell.toString().toLowerCase().includes(searchTerm.toLowerCase())) {
            results.push({
              row: rowIndex + 1,
              col: colIndex + 1,
              value: cell
            })
          }
        })
      })

      return results
    } catch (error) {
      console.error('Erreur recherche sheet:', error)
      throw new Error('Impossible de rechercher dans la feuille')
    }
  }

  // Supprimer une feuille
  async deleteSheet(spreadsheetId: string, sheetId: number): Promise<void> {
    try {
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [{
            deleteSheet: {
              sheetId: sheetId
            }
          }]
        }
      })
    } catch (error) {
      console.error('Erreur suppression sheet:', error)
      throw new Error('Impossible de supprimer la feuille')
    }
  }

  // Ajouter une nouvelle feuille
  async addSheet(spreadsheetId: string, title: string): Promise<SheetInfo> {
    try {
      const response = await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [{
            addSheet: {
              properties: {
                title: title,
                sheetType: 'GRID',
                gridProperties: {
                  rowCount: 1000,
                  columnCount: 26
                }
              }
            }
          }]
        }
      })

      const addedSheet = response.data.replies![0].addSheet!.properties!
      return {
        sheetId: addedSheet.sheetId!,
        title: addedSheet.title!,
        index: addedSheet.index!,
        sheetType: addedSheet.sheetType!,
        gridProperties: {
          rowCount: addedSheet.gridProperties!.rowCount!,
          columnCount: addedSheet.gridProperties!.columnCount!
        }
      }
    } catch (error) {
      console.error('Erreur ajout sheet:', error)
      throw new Error('Impossible d\'ajouter la feuille')
    }
  }
}

export const googleSheetsService = new GoogleSheetsService() 