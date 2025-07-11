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
      setCategory(result.category as DocumentCategory) // ✅ type cast fix
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
    certification: '📋',
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
    certification: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    grant_application: 'bg-red-100 text-red-800 border-red-200',
    other: 'bg-gray-100 text-gray-800 border-gray-200',
    photo: 'bg-cyan-100 text-cyan-800 border-cyan-200'
  }

  // ...rest of your JSX unchanged
}
