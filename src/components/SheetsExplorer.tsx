'use client'

import React, { useState } from 'react'
import { useSheets } from '@/contexts/SheetsContext'
import { 
  FileSpreadsheet, 
  Plus, 
  Search, 
  Grid, 
  List, 
  Download, 
  Upload,
  BarChart3,
  Sparkles
} from 'lucide-react'

export function SheetsExplorer() {
  const {
    spreadsheets,
    currentSpreadsheet,
    currentSheet,
    sheetData,
    isLoading,
    error,
    selectSpreadsheet,
    selectSheet,
    createSpreadsheet,
    updateSheetData,
    analyzeCurrentSheet,
    generateSampleData
  } = useSheets()

  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newSpreadsheetTitle, setNewSpreadsheetTitle] = useState('')
  const [selectedDataType, setSelectedDataType] = useState('ventes')

  // Créer une nouvelle feuille
  const handleCreateSpreadsheet = async () => {
    if (!newSpreadsheetTitle.trim()) return
    
    try {
      await createSpreadsheet(newSpreadsheetTitle)
      setShowCreateModal(false)
      setNewSpreadsheetTitle('')
    } catch (error) {
      console.error('Erreur création:', error)
    }
  }

  // Générer des données d'exemple
  const handleGenerateSampleData = async () => {
    try {
      await generateSampleData(selectedDataType, 15)
    } catch (error) {
      console.error('Erreur génération:', error)
    }
  }

  // Analyser la feuille
  const handleAnalyze = async () => {
    try {
      await analyzeCurrentSheet()
    } catch (error) {
      console.error('Erreur analyse:', error)
    }
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Erreur: {error}</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <FileSpreadsheet className="h-6 w-6 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Google Sheets AI
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus size={16} />
            Nouvelle feuille
          </button>
          
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white text-green-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-green-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher des feuilles de calcul..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar - Liste des feuilles */}
        <div className="w-80 border-r border-gray-200 bg-gray-50">
          <div className="p-4">
            <h3 className="font-medium text-gray-900 mb-3">Mes feuilles de calcul</h3>
            
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : spreadsheets.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileSpreadsheet size={48} className="mx-auto mb-3 text-gray-300" />
                <p className="text-sm">Aucune feuille de calcul</p>
                <p className="text-xs mt-1">Créez votre première feuille</p>
              </div>
            ) : (
              <div className="space-y-2">
                {spreadsheets
                  .filter(sheet => 
                    sheet.title.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((spreadsheet) => (
                    <div
                      key={spreadsheet.spreadsheetId}
                      onClick={() => selectSpreadsheet(spreadsheet.spreadsheetId)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        currentSpreadsheet?.spreadsheetId === spreadsheet.spreadsheetId
                          ? 'bg-green-100 border-green-200 border'
                          : 'bg-white hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {spreadsheet.title}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {spreadsheet.sheets.length} onglet{spreadsheet.sheets.length > 1 ? 's' : ''}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Modifié: {new Date(spreadsheet.modifiedTime).toLocaleDateString()}
                          </p>
                        </div>
                        <FileSpreadsheet size={20} className="text-green-600 flex-shrink-0" />
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {currentSpreadsheet ? (
            <>
              {/* Tabs des onglets */}
              <div className="flex items-center gap-1 p-4 border-b border-gray-200 bg-gray-50">
                {currentSpreadsheet.sheets.map((sheet) => (
                  <button
                    key={sheet.sheetId}
                    onClick={() => selectSheet(sheet)}
                    className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
                      currentSheet?.sheetId === sheet.sheetId
                        ? 'bg-white text-green-600 border-t border-l border-r border-gray-200'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    {sheet.title}
                  </button>
                ))}
              </div>

              {/* Toolbar */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <select
                    value={selectedDataType}
                    onChange={(e) => setSelectedDataType(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="ventes">Données de ventes</option>
                    <option value="employés">Données employés</option>
                    <option value="produits">Catalogue produits</option>
                    <option value="finances">Données financières</option>
                    <option value="inventaire">Inventaire</option>
                    <option value="clients">Base clients</option>
                    <option value="projets">Gestion projets</option>
                  </select>
                  <button
                    onClick={handleGenerateSampleData}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
                  >
                    <Sparkles size={14} />
                    Générer données IA
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAnalyze}
                    disabled={isLoading || sheetData.length === 0}
                    className="flex items-center gap-2 px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm disabled:opacity-50"
                  >
                    <BarChart3 size={14} />
                    Analyser IA
                  </button>
                  
                  <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md">
                    <Download size={16} />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md">
                    <Upload size={16} />
                  </button>
                </div>
              </div>

              {/* Data Grid */}
              <div className="flex-1 overflow-auto p-4">
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  </div>
                ) : sheetData.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Grid size={48} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-lg font-medium">Feuille vide</p>
                    <p className="text-sm mt-1">Générez des données d&apos;exemple avec l&apos;IA</p>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            {sheetData[0]?.map((header, index) => (
                              <th
                                key={index}
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 last:border-r-0"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {sheetData.slice(1).map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-gray-50">
                              {row.map((cell, cellIndex) => (
                                <td
                                  key={cellIndex}
                                  className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200 last:border-r-0"
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <FileSpreadsheet size={64} className="mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">Sélectionnez une feuille de calcul</p>
                <p className="text-sm mt-1">Choisissez une feuille dans la liste ou créez-en une nouvelle</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de création */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Nouvelle feuille de calcul</h3>
            <input
              type="text"
              placeholder="Nom de la feuille..."
              value={newSpreadsheetTitle}
              onChange={(e) => setNewSpreadsheetTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent mb-4"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateSpreadsheet()}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateSpreadsheet}
                disabled={!newSpreadsheetTitle.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 