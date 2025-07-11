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
  const [filterType, setFilterType] = useState('all')
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

    // Fetch properties for filter
    const { data: propertiesData } = await supabase
      .from('properties')
      .select('id, name')
      .order('name')

    setProperties(propertiesData || [])

    // Fetch all documents with property and project info
    const { data: documentsData } = await supabase
      .from('documents')
      .select(`
        *,
        properties(name, address),
        projects(name)
      `)
      .order('created_at', { ascending: false })

    setDocuments(documentsData || [])
    setLoading(false)
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesProperty = filterProperty === 'all' || doc.property_id === filterProperty
    const matchesType = filterType === 'all' || 
      (filterType === 'pdf' && doc.file_type?.includes('pdf')) ||
      (filterType === 'image' && doc.file_type?.includes('image')) ||
      (filterType === 'doc' && (doc.file_type?.includes('document') || doc.file_type?.includes('msword'))) ||
      (filterType === 'sheet' && (doc.file_type?.includes('sheet') || doc.file_type?.includes('excel')))
    
    return matchesSearch && matchesProperty && matchesType
  })

  function getFileIcon(fileType: string) {
    if (fileType?.includes('pdf')) return '📄'
    if (fileType?.includes('image')) return '🖼️'
    if (fileType?.includes('sheet') || fileType?.includes('excel')) return '📊'
    if (fileType?.includes('document') || fileType?.includes('msword')) return '📝'
    return '📎'
  }

  function formatFileSize(bytes: number) {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1024 / 1024).toFixed(1) + ' MB'
  }

  async function handleDelete(documentId: string, fileUrl: string) {
    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      // Extract file path from URL
      const fileName = fileUrl.split('/').pop()
      if (!fileName) return

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
      checkUserAndFetchData()
    } catch (error: any) {
      alert('Error deleting document: ' + error.message)
    }
  }

  const stats = {
    total: documents.length,
    totalSize: documents.reduce((sum, doc) => sum + (doc.file_size || 0), 0),
    byType: {
      pdf: documents.filter(d => d.file_type?.includes('pdf')).length,
      images: documents.filter(d => d.file_type?.includes('image')).length,
      docs: documents.filter(d => d.file_type?.includes('document') || d.file_type?.includes('msword')).length,
      sheets: documents.filter(d => d.file_type?.includes('sheet') || d.file_type?.includes('excel')).length
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-emerald-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading documents...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Document Library</h1>
              <p className="text-indigo-100 mt-1">All your property and project documents in one place</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <p className="text-indigo-100 text-sm">Total Documents</p>
              <p className="text-2xl font-bold mt-1">{stats.total}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <p className="text-indigo-100 text-sm">Total Size</p>
              <p className="text-2xl font-bold mt-1">{formatFileSize(stats.totalSize)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <p className="text-indigo-100 text-sm">PDFs</p>
              <p className="text-2xl font-bold mt-1">{stats.byType.pdf}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <p className="text-indigo-100 text-sm">Images</p>
              <p className="text-2xl font-bold mt-1">{stats.byType.images}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <p className="text-indigo-100 text-sm">Other</p>
              <p className="text-2xl font-bold mt-1">{stats.byType.docs + stats.byType.sheets}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              {properties.map(property => (
                <option key={property.id} value={property.id}>{property.name}</option>
              ))}
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="pdf">PDFs</option>
              <option value="image">Images</option>
              <option value="doc">Documents</option>
              <option value="sheet">Spreadsheets</option>
            </select>
          </div>
        </div>

        {/* Documents Grid */}
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-sm p-12">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterProperty !== 'all' || filterType !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Upload documents from property or project pages'}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">{getFileIcon(doc.file_type)}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{doc.name}</h3>
                      <p className="text-sm text-gray-500">{formatFileSize(doc.file_size)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    {doc.properties?.name}
                  </p>
                  {doc.projects && (
                    <p className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      {doc.projects.name}
                    </p>
                  )}
                  <p className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(doc.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-medium text-center hover:bg-indigo-700 transition-colors"
                  >
                    View
                  </a>
                  <button
                    onClick={() => handleDelete(doc.id, doc.file_url)}
                    className="flex-1 border-2 border-red-500 text-red-500 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Storage Info */}
        <div className="mt-12 bg-gradient-to-r from-indigo-50 to-emerald-50 rounded-xl p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Current Usage</h4>
              <p className="text-sm text-gray-600 mb-2">
                Using {formatFileSize(stats.totalSize)} of 1GB free storage
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-2 rounded-full"
                  style={{ width: `${(stats.totalSize / (1024 * 1024 * 1024)) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Upload Limits</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Maximum file size: 10MB</li>
                <li>• Supported: PDF, Images, Documents, Spreadsheets</li>
                <li>• Files are stored securely in Supabase</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
