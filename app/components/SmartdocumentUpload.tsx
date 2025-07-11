"use client"

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

      const result = await analyzer.analyzeDocument(file)
      setAnalysis(result)
      setCategory(result.category as DocumentCategory)
      setExtractedData(result.extractedData)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setUploading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `${propertyId}/${Date.now()}.${fileExt}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('property-documents')
        .upload(fileName, selectedFile)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('property-documents')
        .getPublicUrl(fileName)

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
    certificate: '📋',
    grant_application: '🎯',
    other: '📄',
    photo: '🖼️'
  }

  const categoryColors: Record<DocumentCategory, string> = {
    invoice: 'bg-blue-100 text-blue-800 border-blue-200',
    contract: 'bg-purple-100 text-purple-800 border-purple-200',
    permit: 'bg-green-100 text-green-800 border-green-200',
    quote: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    receipt: 'bg-gray-100 text-gray-800 border-gray-200',
    plan: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    report: 'bg-pink-100 text-pink-800 border-pink-200',
    certificate: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    grant_application: 'bg-red-100 text-red-800 border-red-200',
    other: 'bg-gray-100 text-gray-800 border-gray-200',
    photo: 'bg-cyan-100 text-cyan-800 border-cyan-200'
  }

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-indigo-400 transition-colors">
        <div className="text-center">
          <input
            id="smart-file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
          />
          <label htmlFor="smart-file-upload" className="cursor-pointer block text-sm font-medium text-gray-900">
            Click to select a document
            <p className="text-xs text-gray-500">PDF, DOC, XLS, PNG, JPG up to 10MB</p>
          </label>
        </div>
      </div>

      {selectedFile && analysis && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Document Analysis</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${categoryColors[category]}`}>
              {categoryIcons[category]} {category.replace('_', ' ')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm font-medium text-gray-700">File Name</p>
              <p className="text-sm text-gray-900">{selectedFile.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Confidence</p>
              <p className="text-sm text-gray-900">{Math.round(analysis.confidence * 100)}%</p>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as DocumentCategory)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              {Object.keys(categoryIcons).map((key) => (
                <option key={key} value={key}>
                  {categoryIcons[key as DocumentCategory]} {key.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </div>
      )}
    </div>
  )
}
