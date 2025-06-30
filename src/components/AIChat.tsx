'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useSheets } from '@/contexts/SheetsContext'
import { 
  Send, 
  Bot, 
  User, 
  Sparkles,
  TrendingUp,
  FileText,
  Lightbulb,
  X
} from 'lucide-react'

export function AIChat() {
  const {
    currentSpreadsheet,
    currentSheet,
    analysis,
    chatHistory,
    sendAIRequest,
    isLoading
  } = useSheets()

  const [message, setMessage] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatHistory])

  // Focus sur l'input quand le chat s'ouvre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Envoyer un message
  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return

    const userMessage = message.trim()
    setMessage('')

    try {
      await sendAIRequest(userMessage)
    } catch (error) {
      console.error('Erreur envoi message:', error)
    }
  }

  // Suggestions rapides
  const quickSuggestions = [
    "Analyse ces données et donne-moi des insights",
    "Génère un graphique pour visualiser les tendances",
    "Trouve les valeurs aberrantes dans ce dataset",
    "Calcule les statistiques principales",
    "Suggère des améliorations pour cette feuille",
    "Crée une formule pour calculer la moyenne mobile"
  ]

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 z-50"
      >
        <div className="flex items-center gap-2">
          <Sparkles size={24} />
          <span className="hidden sm:block font-medium">Assistant IA</span>
        </div>
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-full">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-semibold">Assistant IA</h3>
            <p className="text-xs opacity-90">
              {currentSpreadsheet ? currentSpreadsheet.title : 'Google Sheets AI'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Message de bienvenue */}
        {chatHistory.length === 0 && (
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
              <Bot size={16} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="text-sm text-gray-800">
                  Bonjour ! Je suis votre assistant IA pour Google Sheets. 
                  Je peux vous aider à analyser vos données, créer des formules, 
                  générer des insights et bien plus encore.
                </p>
                {currentSpreadsheet && (
                  <p className="text-xs text-gray-600 mt-2">
                    Feuille actuelle: <span className="font-medium">{currentSpreadsheet.title}</span>
                    {currentSheet && ` - ${currentSheet.title}`}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Historique des messages */}
        {chatHistory.map((msg, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className={`p-2 rounded-full ${
              msg.role === 'user' 
                ? 'bg-green-100' 
                : 'bg-gradient-to-r from-blue-100 to-purple-100'
            }`}>
              {msg.role === 'user' ? (
                <User size={16} className="text-green-600" />
              ) : (
                <Bot size={16} className="text-blue-600" />
              )}
            </div>
            <div className="flex-1">
              <div className={`rounded-lg p-3 ${
                msg.role === 'user' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-gray-100'
              }`}>
                <p className="text-sm text-gray-800">{msg.content}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Analyse en cours */}
        {analysis && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} className="text-purple-600" />
              <h4 className="font-medium text-purple-800">Analyse des données</h4>
            </div>
            <div className="space-y-3">
              <div>
                <h5 className="text-sm font-medium text-gray-700">Résumé</h5>
                <p className="text-sm text-gray-600">{analysis.summary}</p>
              </div>
              {analysis.insights.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700">Insights</h5>
                  <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                    {analysis.insights.map((insight, i) => (
                      <li key={i}>{insight}</li>
                    ))}
                  </ul>
                </div>
              )}
              {analysis.recommendations.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700">Recommandations</h5>
                  <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                    {analysis.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
              <Bot size={16} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-gray-600">Analyse en cours...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Suggestions rapides */}
        {chatHistory.length === 0 && !isLoading && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 font-medium">Suggestions rapides :</p>
            <div className="grid grid-cols-1 gap-2">
              {quickSuggestions.slice(0, 3).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setMessage(suggestion)
                    handleSendMessage()
                  }}
                  className="text-left p-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-xs text-blue-700 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={
              currentSpreadsheet 
                ? "Posez une question sur vos données..." 
                : "Comment puis-je vous aider ?"
            }
            disabled={isLoading}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:opacity-50"
          />
          <button
            onClick={handleSendMessage}
            disabled={!message.trim() || isLoading}
            className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </div>
        
        {/* Actions rapides */}
        <div className="flex items-center gap-1 mt-2">
          <button
            onClick={() => setMessage("Analyse ces données")}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
          >
            <TrendingUp size={12} />
            Analyser
          </button>
          <button
            onClick={() => setMessage("Suggère des formules utiles")}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
          >
            <Lightbulb size={12} />
            Formules
          </button>
          <button
            onClick={() => setMessage("Génère un résumé de ces données")}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
          >
            <FileText size={12} />
            Résumé
          </button>
        </div>
      </div>
    </div>
  )
} 