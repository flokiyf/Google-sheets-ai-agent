'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { SpreadsheetInfo, SheetInfo } from '@/lib/google-sheets'
import { AIResponse, SheetAnalysis } from '@/lib/openai-agent'

interface SheetsContextType {
  // État des feuilles
  spreadsheets: SpreadsheetInfo[]
  currentSpreadsheet: SpreadsheetInfo | null
  currentSheet: SheetInfo | null
  sheetData: string[][]
  isLoading: boolean
  error: string | null

  // État de l'IA
  aiResponse: AIResponse | null
  analysis: SheetAnalysis | null
  chatHistory: { role: 'user' | 'assistant', content: string }[]
  
  // Actions
  loadSpreadsheets: () => Promise<void>
  selectSpreadsheet: (spreadsheetId: string) => Promise<void>
  selectSheet: (sheetInfo: SheetInfo) => Promise<void>
  createSpreadsheet: (title: string, sheetNames?: string[]) => Promise<SpreadsheetInfo>
  updateSheetData: (range: string, values: string[][]) => Promise<void>
  
  // Actions IA
  sendAIRequest: (prompt: string) => Promise<void>
  analyzeCurrentSheet: () => Promise<void>
  generateSampleData: (type: string, rows?: number) => Promise<void>
  clearAIResponse: () => void
  addToChatHistory: (role: 'user' | 'assistant', content: string) => void
}

const SheetsContext = createContext<SheetsContextType | undefined>(undefined)

export function SheetsProvider({ children }: { children: React.ReactNode }) {
  // État des feuilles
  const [spreadsheets, setSpreadsheets] = useState<SpreadsheetInfo[]>([])
  const [currentSpreadsheet, setCurrentSpreadsheet] = useState<SpreadsheetInfo | null>(null)
  const [currentSheet, setCurrentSheet] = useState<SheetInfo | null>(null)
  const [sheetData, setSheetData] = useState<string[][]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // État de l'IA
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null)
  const [analysis, setAnalysis] = useState<SheetAnalysis | null>(null)
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant', content: string }[]>([])

  // Charger les feuilles de calcul (simulation - en réalité on aurait une liste depuis l'API)
  const loadSpreadsheets = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Simulation - en réalité, on récupérerait la liste depuis Google Drive API
      const mockSpreadsheets: SpreadsheetInfo[] = []
      setSpreadsheets(mockSpreadsheets)
    } catch (err) {
      setError('Erreur lors du chargement des feuilles')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Sélectionner une feuille de calcul
  const selectSpreadsheet = async (spreadsheetId: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/sheets/${spreadsheetId}`)
      if (!response.ok) throw new Error('Erreur chargement spreadsheet')
      
      const spreadsheet: SpreadsheetInfo = await response.json()
      setCurrentSpreadsheet(spreadsheet)
      
      // Sélectionner la première feuille par défaut
      if (spreadsheet.sheets.length > 0) {
        await selectSheet(spreadsheet.sheets[0])
      }
    } catch (err) {
      setError('Erreur lors de la sélection de la feuille')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Sélectionner un onglet de feuille
  const selectSheet = async (sheetInfo: SheetInfo) => {
    if (!currentSpreadsheet) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/sheets/${currentSpreadsheet.spreadsheetId}/data?sheet=${sheetInfo.title}`)
      if (!response.ok) throw new Error('Erreur chargement données')
      
      const data: string[][] = await response.json()
      setCurrentSheet(sheetInfo)
      setSheetData(data)
    } catch (err) {
      setError('Erreur lors du chargement des données')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Créer une nouvelle feuille de calcul
  const createSpreadsheet = async (title: string, sheetNames?: string[]): Promise<SpreadsheetInfo> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/sheets/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, sheetNames })
      })
      
      if (!response.ok) throw new Error('Erreur création spreadsheet')
      
      const newSpreadsheet: SpreadsheetInfo = await response.json()
      setSpreadsheets(prev => [...prev, newSpreadsheet])
      setCurrentSpreadsheet(newSpreadsheet)
      
      if (newSpreadsheet.sheets.length > 0) {
        await selectSheet(newSpreadsheet.sheets[0])
      }
      
      return newSpreadsheet
    } catch (err) {
      setError('Erreur lors de la création')
      console.error(err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Mettre à jour les données d'une feuille
  const updateSheetData = async (range: string, values: string[][]) => {
    if (!currentSpreadsheet || !currentSheet) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/sheets/${currentSpreadsheet.spreadsheetId}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sheetName: currentSheet.title,
          range,
          values 
        })
      })
      
      if (!response.ok) throw new Error('Erreur mise à jour')
      
      // Recharger les données
      await selectSheet(currentSheet)
    } catch (err) {
      setError('Erreur lors de la mise à jour')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Envoyer une requête à l'IA
  const sendAIRequest = async (prompt: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      addToChatHistory('user', prompt)
      
      const response = await fetch('/api/ai/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          spreadsheetId: currentSpreadsheet?.spreadsheetId,
          sheetName: currentSheet?.title,
          context: `Feuille: ${currentSpreadsheet?.title}, Onglet: ${currentSheet?.title}`
        })
      })
      
      if (!response.ok) throw new Error('Erreur requête IA')
      
      const aiResp: AIResponse = await response.json()
      setAiResponse(aiResp)
      addToChatHistory('assistant', aiResp.response)
      
      // Exécuter l'action suggérée si nécessaire
      if (aiResp.action === 'write' && aiResp.data && currentSpreadsheet && currentSheet) {
        await updateSheetData('A1:Z100', aiResp.data)
      }
    } catch (err) {
      setError('Erreur lors de la requête IA')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Analyser la feuille actuelle
  const analyzeCurrentSheet = async () => {
    if (!currentSpreadsheet || !currentSheet) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spreadsheetId: currentSpreadsheet.spreadsheetId,
          sheetName: currentSheet.title
        })
      })
      
      if (!response.ok) throw new Error('Erreur analyse')
      
      const analysisResult: SheetAnalysis = await response.json()
      setAnalysis(analysisResult)
    } catch (err) {
      setError('Erreur lors de l\'analyse')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Générer des données d'exemple
  const generateSampleData = async (type: string, rows: number = 10) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/ai/generate-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, rows })
      })
      
      if (!response.ok) throw new Error('Erreur génération données')
      
      const data: string[][] = await response.json()
      
      if (currentSpreadsheet && currentSheet) {
        await updateSheetData('A1:Z100', data)
      }
    } catch (err) {
      setError('Erreur lors de la génération')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Effacer la réponse IA
  const clearAIResponse = () => {
    setAiResponse(null)
  }

  // Ajouter au chat
  const addToChatHistory = (role: 'user' | 'assistant', content: string) => {
    setChatHistory(prev => [...prev, { role, content }])
  }

  // Charger les feuilles au montage
  useEffect(() => {
    loadSpreadsheets()
  }, [])

  const value: SheetsContextType = {
    // État
    spreadsheets,
    currentSpreadsheet,
    currentSheet,
    sheetData,
    isLoading,
    error,
    aiResponse,
    analysis,
    chatHistory,
    
    // Actions
    loadSpreadsheets,
    selectSpreadsheet,
    selectSheet,
    createSpreadsheet,
    updateSheetData,
    sendAIRequest,
    analyzeCurrentSheet,
    generateSampleData,
    clearAIResponse,
    addToChatHistory
  }

  return (
    <SheetsContext.Provider value={value}>
      {children}
    </SheetsContext.Provider>
  )
}

export function useSheets() {
  const context = useContext(SheetsContext)
  if (context === undefined) {
    throw new Error('useSheets must be used within a SheetsProvider')
  }
  return context
} 