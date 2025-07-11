'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DocumentAnalyzer, DocumentCategory } from '@/lib/documentAnalyzer'

interface SmartDocumentUploadProps {
  propertyId: string
  projectId?: string
  onUploadComplete: () => void
}

export default function SmartDocumentUpload({ propertyId, projectId, onUploadComplete }: SmartDocumentUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [analysis, setAnalysis] = useState<any>(null)
  const [category, setCategory] = useState<DocumentCategory>('other')
  const [extractedData, setExtractedData] = useState<any>({})
  const supabase = createClient()
  const analyzer = new DocumentAnalyzer()

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      
      // Analyze the document
      const result = await analyzer.analyzeDocument(file)
      setAnalysis(result)
      setCategory(result.category)
      setExtractedData(result.extractedData)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Create unique file name
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `${propertyId}/${Date.now()}.${fileExt}`

      // Upload file
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('property-documents')
        .upload(fileName, selectedFile)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('property-documents')
        .getPublicUrl(fileName)

      // Save document with analysis metadata
      const { data: document, error: dbError } = await supabase
        .from('documents')
        .insert({
          property_id: propertyId,
          project_id: projectId || null,
          name: selectedFile.name,
          file_url: publicUrl,
          file_size: selectedFile.size,
          file_type: selectedFile.type,
          uploaded_by: user.id,
          metadata: {
            category,
            analysis,
            extractedData,
            analyzedAt: new Date().toISOString()
          }
        })
        .select()
        .single()

      if (dbError) throw dbError

      // Reset form
      setSelectedFile(null)
      setAnalysis(null)
      setExtractedData({})
      onUploadComplete()
      alert('Document uploaded and analyzed successfully!')
      
    } catch (error: any) {
      alert('Error uploading document: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const categoryIcons: Record<DocumentCategory, string> = {
    invoice: '🧾',
    contract: '📜',
    permit: '🏛️',
    quote: '💰',
    receipt: '🧾',
    plan: '📐',
    report: '📊',
    certification: '📋',
    grant_application: '🎯',
    other: '📄'
  }

  const categoryColors: Record<DocumentCategory, string> = {
    invoice: 'bg-blue-100 text-blue-800 border-blue-200',
    contract: 'bg-purple-100 text-purple-800 border-purple-200',
    permit: 'bg-green-100 text-green-800 border-green-200',
    quote: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    receipt: 'bg-gray-100 text-gray-800 border-gray-200',
    plan: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    report: 'bg-pink-100 text-pink-800 border-pink-200',
    certification: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    grant_application: 'bg-red-100 text-red-800 border-red-200',
    other: 'bg-gray-100 text-gray-800 border-gray-200'
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-indigo-400 transition-colors">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          
          <div className="mt-4">
            <label htmlFor="smart-file-upload" className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Click to select a document
              </span>
              <span className="text-xs text-gray-500">
                AI will analyze and categorize your document
              </span>
              <input
                id="smart-file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
              />
            </label>
            <p className="text-xs text-gray-500 mt-2">
              PDF, DOC, DOCX, XLS, XLSX, PNG, JPG up to 10MB
            </p>
          </div>
        </div>
      </div>

      {/* Analysis Results */}
      {selectedFile && analysis && (
        <div className="bg-gradient-to-r from-indigo-50 to-emerald-50 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Document Analysis</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${categoryColors[analysis.category]}`}>
              {categoryIcons[analysis.category]} {analysis.category.replace('_', ' ')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700">File Name</p>
              <p className="text-sm text-gray-900">{selectedFile.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Confidence</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-2 rounded-full"
                    style={{ width: `${analysis.confidence * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600">{Math.round(analysis.confidence * 100)}%</span>
              </div>
            </div>
          </div>

          {/* Extracted Data */}
          {Object.keys(analysis.extractedData).length > 0 && (
            <div className="bg-white/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Extracted Information</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {analysis.extractedData.documentNumber && (
                  <>
                    <span className="text-gray-600">Document #:</span>
                    <span className="text-gray-900">{analysis.extractedData.documentNumber}</span>
                  </>
                )}
                {analysis.extractedData.documentDate && (
                  <>
                    <span className="text-gray-600">Date:</span>
                    <span className="text-gray-900">{analysis.extractedData.documentDate}</span>
                  </>
                )}
                {analysis.extractedData.totalAmount && (
                  <>
                    <span className="text-gray-600">Amount:</span>
                    <span className="text-gray-900">€{analysis.extractedData.totalAmount}</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Category Override */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Category (you can change this)
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as DocumentCategory)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="invoice">🧾 Invoice / Fattura</option>
              <option value="contract">📜 Contract / Contratto</option>
              <option value="permit">🏛️ Permit / Permesso</option>
              <option value="quote">💰 Quote / Preventivo</option>
              <option value="receipt">🧾 Receipt / Ricevuta</option>
              <option value="plan">📐 Plan / Planimetria</option>
              <option value="report">📊 Report / Relazione</option>
              <option value="certification">📋 Certification / Certificato</option>
              <option value="grant_application">🎯 Grant Application</option>
              <option value="other">📄 Other</option>
            </select>
          </div>

          {/* Additional Fields for Invoices */}
          {(category === 'invoice' || category === 'receipt') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vendor / Fornitore
                </label>
                <input
                  type="text"
                  value={extractedData.vendor || ''}
                  onChange={(e) => setExtractedData({ ...extractedData, vendor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  VAT Number / P.IVA
                </label>
                <input
                  type="text"
                  value={extractedData.vatNumber || ''}
                  onChange={(e) => setExtractedData({ ...extractedData, vatNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="IT12345678901"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount / Importo (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={extractedData.totalAmount || ''}
                  onChange={(e) => setExtractedData({ ...extractedData, totalAmount: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Date / Data
                </label>
                <input
                  type="date"
                  value={extractedData.documentDate || ''}
                  onChange={(e) => setExtractedData({ ...extractedData, documentDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          )}

          {/* Upload Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload Document'}
            </button>
            <button
              onClick={() => {
                setSelectedFile(null)
                setAnalysis(null)
                setExtractedData({})
              }}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Grant Compliance Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="flex items-center gap-2 font-medium text-yellow-800 mb-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Grant Documentation Tips
        </h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Ensure invoices include vendor P.IVA (VAT number)</li>
          <li>• Permits must show expiry dates and issuing authority</li>
          <li>• Keep all documents in high resolution (PDF preferred)</li>
          <li>• Contracts should clearly identify all parties involved</li>
        </ul>
      </div>
    </div>
  )
}
