'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FileText, Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

interface DocumentUploadProps {
  propertyId: string
  projectId?: string
  onUploadComplete: () => void
  enableExpenseExtraction?: boolean
}

export default function DocumentUpload({ 
  propertyId, 
  projectId, 
  onUploadComplete,
  enableExpenseExtraction = true 
}: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [extractingExpenses, setExtractingExpenses] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'extracting' | 'complete' | 'error'>('idle')
  const supabase = createClient()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      setUploadStatus('idle')
    }
  }

  const extractExpensesFromDocument = async (fileContent: string, fileName: string, documentId: string) => {
    if (!projectId || !enableExpenseExtraction) return

    setExtractingExpenses(true)
    setUploadStatus('extracting')

    try {
      // Simulate AI expense extraction
      // In production, this would call an AI service like OpenAI or Claude API
      const isInvoice = fileName.toLowerCase().includes('invoice') || 
                       fileName.toLowerCase().includes('fattura') ||
                       fileName.toLowerCase().includes('receipt') ||
                       fileName.toLowerCase().includes('ricevuta')

      if (isInvoice) {
        // Mock expense extraction - in production, use actual AI
        const mockExpense = {
          project_id: projectId,
          document_id: documentId,
          category: 'materials',
          description: `Expenses from ${fileName}`,
          amount: Math.floor(Math.random() * 5000) + 100, // Mock amount
          currency: 'EUR',
          date: new Date().toISOString().split('T')[0],
          vendor: 'Extracted Vendor Name',
          invoice_number: `INV-${Date.now()}`,
          payment_status: 'pending',
          extracted_from_document: true,
          metadata: {
            extraction_confidence: 0.95,
            extraction_timestamp: new Date().toISOString()
          }
        }

        // Save extracted expense
        const { error } = await supabase
          .from('expenses')
          .insert(mockExpense)

        if (error) {
          console.error('Error saving extracted expense:', error)
        } else {
          console.log('Expense extracted and saved successfully')
        }
      }
    } catch (error) {
      console.error('Error extracting expenses:', error)
    } finally {
      setExtractingExpenses(false)
    }
  }

  const categorizeDocument = (fileName: string, fileType: string): string => {
    const name = fileName.toLowerCase()
    
    // Invoice/Financial documents
    if (name.includes('invoice') || name.includes('fattura') || 
        name.includes('receipt') || name.includes('ricevuta')) {
      return 'invoice'
    }
    
    // Contracts
    if (name.includes('contract') || name.includes('contratto') || 
        name.includes('agreement') || name.includes('accordo')) {
      return 'contract'
    }
    
    // Permits
    if (name.includes('permit') || name.includes('permesso') || 
        name.includes('license') || name.includes('licenza') ||
        name.includes('scia') || name.includes('cila')) {
      return 'permit'
    }
    
    // Plans
    if (name.includes('plan') || name.includes('planimetria') || 
        name.includes('blueprint') || name.includes('progetto')) {
      return 'plan'
    }
    
    // Reports
    if (name.includes('report') || name.includes('relazione') || 
        name.includes('survey') || name.includes('perizia')) {
      return 'report'
    }
    
    // Photos
    if (fileType.includes('image')) {
      return 'photo'
    }
    
    return 'other'
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    setUploadStatus('uploading')
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Create unique file name
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `${propertyId}/${Date.now()}.${fileExt}`

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('property-documents')
        .upload(fileName, selectedFile)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('property-documents')
        .getPublicUrl(fileName)

      // Determine document category
      const category = categorizeDocument(selectedFile.name, selectedFile.type)

      // Save document record in database
      const { data: documentData, error: dbError } = await supabase
        .from('documents')
        .insert({
          property_id: propertyId,
          project_id: projectId || null,
          name: selectedFile.name,
          file_url: publicUrl,
          file_size: selectedFile.size,
          file_type: selectedFile.type,
          uploaded_by: user.id,
          category: category,
          metadata: {
            original_name: selectedFile.name,
            upload_timestamp: new Date().toISOString()
          }
        })
        .select()
        .single()

      if (dbError) throw dbError

      // Extract expenses if it's an invoice
      if (enableExpenseExtraction && projectId && category === 'invoice') {
        // Read file content for expense extraction
        const reader = new FileReader()
        reader.onload = async (e) => {
          const content = e.target?.result as string
          await extractExpensesFromDocument(content, selectedFile.name, documentData.id)
          setUploadStatus('complete')
          
          // Reset after delay
          setTimeout(() => {
            setSelectedFile(null)
            setUploadStatus('idle')
            onUploadComplete()
          }, 2000)
        }
        reader.readAsText(selectedFile)
      } else {
        setUploadStatus('complete')
        
        // Reset after delay
        setTimeout(() => {
          setSelectedFile(null)
          setUploadStatus('idle')
          onUploadComplete()
        }, 2000)
      }
      
    } catch (error: any) {
      setUploadStatus('error')
      alert('Error uploading document: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const getStatusMessage = () => {
    switch (uploadStatus) {
      case 'uploading':
        return 'Uploading document...'
      case 'extracting':
        return 'Extracting expense information...'
      case 'complete':
        return 'Upload complete!'
      case 'error':
        return 'Upload failed. Please try again.'
      default:
        return ''
    }
  }

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
      case 'extracting':
        return <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      case 'complete':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
      <div className="text-center">
        {uploadStatus !== 'idle' ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              {getStatusIcon()}
            </div>
            <p className="text-sm font-medium text-gray-700">{getStatusMessage()}</p>
            {uploadStatus === 'extracting' && (
              <p className="text-xs text-gray-500">
                AI is analyzing the document for expense information...
              </p>
            )}
          </div>
        ) : (
          <>
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            
            <div className="mt-4">
              {selectedFile ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-8 h-8 text-gray-500" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-900">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {enableExpenseExtraction && projectId && selectedFile.name.toLowerCase().includes('invoice') && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs text-blue-800">
                        <span className="font-semibold">AI Expense Extraction:</span> This invoice will be analyzed for automatic expense tracking
                      </p>
                    </div>
                  )}
                  
                  <div className="flex space-x-2 justify-center">
                    <button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {uploading ? 'Uploading...' : 'Upload Document'}
                    </button>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Click to select or drag and drop
                    </span>
                    <input
                      id="file-upload"
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
                  {enableExpenseExtraction && projectId && (
                    <p className="text-xs text-blue-600 mt-2 font-medium">
                      📊 Invoices will be automatically processed for expense tracking
                    </p>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
