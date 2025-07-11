// File: app/documents/page.tsx

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([])
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterProperty, setFilterProperty] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkUserAndFetchData()
  }, [])

  async function checkUserAndFetchData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    
    await Promise.all([fetchDocuments(), fetchProperties()])
    setLoading(false)
  }

  async function fetchDocuments() {
    const { data, error } = await supabase
      .from('documents')
      .select(`
        *,
        properties (
          name,
          address
        ),
        projects (
          name
        )
      `)
      .order('created_at', { ascending: false })

    if (!error) {
      setDocuments(data || [])
    }
  }

  async function fetchProperties() {
    const { data, error } = await supabase
      .from('properties')
      .select('id, name')
      .order('name')

    if (!error) {
      setProperties(data || [])
    }
  }

  async function handleDelete(documentId: string, fileUrl: string) {
    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      // Extract filename from URL
      const fileName = fileUrl.split('/').pop()
      
      if (fileName) {
        // Delete from storage
        await supabase.storage
          .from('property-documents')
          .remove([fileName])
      }

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

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.properties?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.projects?.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesProperty = filterProperty === 'all' || doc.property_id === filterProperty
    
    return matchesSearch && matchesProperty
  })

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading documents...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600 mt-1">All your property and project documents in one place</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <select
              value={filterProperty}
              onChange={(e) => setFilterProperty(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Properties</option>
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Documents List */}
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-sm p-12">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
              <p className="text-gray-500 mb-4">
                Upload documents from your property or project pages
              </p>
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
              >
                Go to Properties
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{getFileIcon(doc.file_type)}</div>
                  <button
                    onClick={() => handleDelete(doc.id, doc.file_url)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2 truncate">{doc.name}</h3>
                
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Property: {doc.properties?.name || 'N/A'}</p>
                  {doc.projects && <p>Project: {doc.projects.name}</p>}
                  <p>Size: {formatFileSize(doc.file_size)}</p>
                  <p>Uploaded: {new Date(doc.created_at).toLocaleDateString()}</p>
                </div>

                <div className="mt-4 flex gap-2">
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-medium text-center hover:bg-indigo-700 transition-colors"
                  >
                    View
                  </a>
                  <a
                    href={doc.file_url}
                    download
                    className="flex-1 border-2 border-gray-300 text-gray-700 py-2 rounded-lg font-medium text-center hover:bg-gray-50 transition-colors"
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">How to upload documents</h3>
          <ol className="list-decimal list-inside text-blue-800 space-y-1">
            <li>Go to any property or project page</li>
            <li>Navigate to the Documents tab</li>
            <li>Click or drag to upload your files</li>
            <li>Supported formats: PDF, DOC, DOCX, XLS, XLSX, PNG, JPG</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
