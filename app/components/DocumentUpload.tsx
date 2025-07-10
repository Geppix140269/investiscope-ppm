'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface DocumentUploadProps {
  propertyId: string
  projectId?: string
  onUploadComplete: () => void
}

export default function DocumentUpload({ propertyId, projectId, onUploadComplete }: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const supabase = createClient()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    
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

      // Save document record in database
      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          property_id: propertyId,
          project_id: projectId || null,
          name: selectedFile.name,
          file_url: publicUrl,
          file_size: selectedFile.size,
          file_type: selectedFile.type,
          uploaded_by: user.id
        })

      if (dbError) throw dbError

      // Reset and notify parent
      setSelectedFile(null)
      onUploadComplete()
      alert('Document uploaded successfully!')
      
    } catch (error: any) {
      alert('Error uploading document: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
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
          {selectedFile ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
              <div className="flex space-x-2 justify-center">
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Click to select a document
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}
