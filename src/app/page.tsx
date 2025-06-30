'use client'

import React from 'react'
import { SheetsExplorer } from '@/components/SheetsExplorer'
import { AIChat } from '@/components/AIChat'
import { 
  FileSpreadsheet, 
  Sparkles, 
  TrendingUp, 
  Bot,
  Zap,
  BarChart3
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
                <FileSpreadsheet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Google Sheets AI
                </h1>
                <p className="text-sm text-gray-500">
                  Assistant intelligent pour vos feuilles de calcul
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
                <Sparkles size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                  Propulsé par OpenAI
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">
              Révolutionnez vos feuilles de calcul avec l&apos;IA
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Créez, analysez et optimisez vos données Google Sheets grâce à l&apos;intelligence artificielle. 
              Générez des insights, des formules et des visualisations en quelques clics.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-4 mx-auto">
                  <Bot size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">Assistant IA Intelligent</h3>
                <p className="text-blue-100 text-sm">
                  Posez des questions en langage naturel et obtenez des réponses précises sur vos données
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-4 mx-auto">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">Analyses Avancées</h3>
                <p className="text-blue-100 text-sm">
                  Découvrez des tendances cachées et obtenez des insights automatiques sur vos données
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-4 mx-auto">
                  <Zap size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">Génération Automatique</h3>
                <p className="text-blue-100 text-sm">
                  Créez des données d&apos;exemple, des formules complexes et des rapports automatiquement
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <SheetsExplorer />
        </div>
      </main>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Fonctionnalités Puissantes
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez tout ce que vous pouvez faire avec Google Sheets AI
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-lg mb-4 mx-auto">
                <FileSpreadsheet size={32} className="text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Création Rapide
              </h4>
              <p className="text-gray-600 text-sm">
                Créez des feuilles de calcul complexes en quelques secondes
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-lg mb-4 mx-auto">
                <BarChart3 size={32} className="text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Analyses Intelligentes
              </h4>
              <p className="text-gray-600 text-sm">
                Obtenez des statistiques et des insights automatiquement
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-4 mx-auto">
                <Sparkles size={32} className="text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Génération IA
              </h4>
              <p className="text-gray-600 text-sm">
                Générez des données d&apos;exemple réalistes pour vos tests
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-lg mb-4 mx-auto">
                <Bot size={32} className="text-orange-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Chat Intelligent
              </h4>
              <p className="text-gray-600 text-sm">
                Discutez avec l&apos;IA pour optimiser vos feuilles de calcul
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Chat Component */}
      <AIChat />
    </div>
  )
}
