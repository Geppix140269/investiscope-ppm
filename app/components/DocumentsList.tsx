'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface DocumentsListProps {
  propertyId: string
  projectId?: string
  refreshTrigger?: number
}

export default function DocumentsList({ propertyId, projectId, refreshTrigger }: DocumentsListProps) {
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchDocuments()
  }, [propertyId, projectId, refreshTrigger])

  async function fetchDocuments() {
    let query = supabase
      .from('documents')
      .select('*')
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false })

    if (projectId) {
      query = query.eq('project_id', projectId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching documents:', error)
    } else {
      setDocuments(data || [])
    }
    setLoading(false)
  }

  async function handleDelete(documentId: string, fileName: string) {
    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      // Delete from storage
      await supabase.storage
        .from('property-documents')
        .remove([fileName])

      // Delete from database
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId)

      if (error) throw error

      // Refresh list
      fetchDocuments()
    } catch (error: any) {
      alert('Error deleting document: ' + error.message)
    }
  }

  function getFileIcon(fileType: string) {
    if (fileType.includes('pdf')) return '📄'
    if (fileType.includes('image')) return '🖼️'
    if (fileType.includes('sheet')) return '📊'
    if (fileType.includes('document')) return '📝'
    return '📎'
  }

  function formatFileSize(bytes: number) {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1024 / 1024).toFixed(1) + ' MB'
  }

  if (loading) return <div>Loading documents...</div>

  if (documents.length === 0) {
    return <p className="text-gray-500 text-center py-4">No documents uploaded yet.</p>
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getFileIcon(doc.file_type)}</span>
            <div>
              <p className="font-medium text-sm">{doc.name}</p>
              <p className="text-xs text-gray-500">
                {formatFileSize(doc.file_size)} • {new Date(doc.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            
              href={doc.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 text-sm"
            >
              View
            </a>
            <button
              onClick={() => {
                const fileName = doc.file_url.split('/').pop()
                if (fileName) {
                  handleDelete(doc.id, fileName)
                }
              }}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
