'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DocumentUpload from '@/app/components/DocumentUpload'
import DocumentsList from '@/app/components/DocumentsList'

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const supabase = createClient()
  const [property, setProperty] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [refreshDocuments, setRefreshDocuments] = useState(0)

  useEffect(() => {
    fetchPropertyDetails()
  }, [params.id])

  async function fetchPropertyDetails() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    // Fetch property
    const { data: propertyData, error: propertyError } = await supabase
      .from('properties')
      .select('*')
      .eq('id', params.id)
      .single()

    if (propertyError || !propertyData) {
      router.push('/dashboard')
      return
    }

    setProperty(propertyData)

    // Fetch projects
    const { data: projectsData } = await supabase
      .from('projects')
      .select('*')
      .eq('property_id', params.id)
      .order('created_at', { ascending: false })

    setProjects(projectsData || [])
    setLoading(false)
  }

  async function handleDeleteProperty() {
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return
    }

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', params.id)

    if (error) {
      alert('Error deleting property: ' + error.message)
    } else {
      router.push('/dashboard')
    }
  }

  function calculateROI() {
    if (!property?.purchase_price) return 'N/A'
    const currentValue = property.current_value || property.purchase_price
    const roi = ((currentValue - property.purchase_price) / property.purchase_price) * 100
    return roi.toFixed(2) + '%'
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
                ← Back
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">{property.name}</h1>
            </div>
            <div className="flex space-x-2">
              <Link
                href={`/properties/${params.id}/edit`}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Edit Property
              </Link>
              <button
                onClick={handleDeleteProperty}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Delete Property
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Property Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Purchase Price</h3>
            <p className="text-2xl font-bold text-gray-900">
              €{property.purchase_price?.toLocaleString() || 'N/A'}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Current Value</h3>
            <p className="text-2xl font-bold text-gray-900">
              €{(property.current_value || property.purchase_price)?.toLocaleString() || 'N/A'}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">ROI</h3>
            <p className="text-2xl font-bold text-gray-900">{calculateROI()}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Active Projects</h3>
            <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === 'projects'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Projects ({projects.length})
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === 'documents'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Documents
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Property Details</h3>
                    <dl className="space-y-3">
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Type</dt>
                        <dd className="text-sm text-gray-900 capitalize">{property.property_type}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Size</dt>
                        <dd className="text-sm text-gray-900">{property.size_sqm ? `${property.size_sqm} m²` : 'N/A'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Address</dt>
                        <dd className="text-sm text-gray-900">{property.address}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">City</dt>
                        <dd className="text-sm text-gray-900">{property.city}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Postal Code</dt>
                        <dd className="text-sm text-gray-900">{property.postal_code || 'N/A'}</dd>
                      </div>
                    </dl>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Description</h3>
                    <p className="text-sm text-gray-600">
                      {property.description || 'No description provided.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <div>
                <div className="mb-4">
                  <Link
                    href={`/properties/${params.id}/projects/new`}
                    className="inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  >
                    + New Project
                  </Link>
                </div>
                {projects.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No projects yet. Create your first project!</p>
                ) : (
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">{project.name}</h4>
                            <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <span>Status: <span className="capitalize">{project.status}</span></span>
                              <span>Budget: €{project.budget?.toLocaleString() || 'N/A'}</span>
                            </div>
                          </div>
                          <Link
                            href={`/projects/${project.id}`}
                            className="text-blue-500 hover:text-blue-700 text-sm"
                          >
                            View Details →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Document</h3>
                  <DocumentUpload
                    propertyId={params.id}
                    onUploadComplete={() => setRefreshDocuments(prev => prev + 1)}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Documents</h3>
                  <DocumentsList
                    propertyId={params.id}
                    refreshTrigger={refreshDocuments}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
