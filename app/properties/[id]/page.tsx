'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DocumentUpload from '@/components/DocumentUpload'
import DocumentsList from '@/components/DocumentsList'

export default function PropertyDetailsPage({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddProject, setShowAddProject] = useState(false)
  const [documentsRefresh, setDocumentsRefresh] = useState(0)
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    budget: '',
    start_date: ''
  })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchPropertyDetails()
  }, [params.id])

  async function fetchPropertyDetails() {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    // Fetch property details
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

    // Fetch projects for this property
    const { data: projectsData } = await supabase
      .from('projects')
      .select('*')
      .eq('property_id', params.id)
      .order('created_at', { ascending: false })

    setProjects(projectsData || [])
    setLoading(false)
  }

  async function handleDeleteProperty() {
    if (!confirm('Are you sure you want to delete this property? This will also delete all associated projects.')) {
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

  async function handleAddProject(e: React.FormEvent) {
    e.preventDefault()
    
    const { error } = await supabase
      .from('projects')
      .insert({
        property_id: params.id,
        name: projectForm.name,
        description: projectForm.description,
        budget: projectForm.budget ? parseFloat(projectForm.budget) : null,
        start_date: projectForm.start_date || null
      })

    if (error) {
      alert('Error creating project: ' + error.message)
    } else {
      setShowAddProject(false)
      setProjectForm({ name: '', description: '', budget: '', start_date: '' })
      fetchPropertyDetails() // Refresh the data
    }
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
            <button
              onClick={handleDeleteProperty}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Delete Property
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Property Details Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Property Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium">{property.address}</p>
              <p className="font-medium">{property.city} {property.postal_code}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <p className="font-medium capitalize">{property.property_type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Size</p>
              <p className="font-medium">{property.size_sqm ? `${property.size_sqm} m²` : 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Purchase Price</p>
              <p className="font-medium text-lg">
                {property.purchase_price ? `€${property.purchase_price.toLocaleString()}` : 'Not specified'}
              </p>
            </div>
          </div>
          {property.description && (
            <div className="mt-6">
              <p className="text-sm text-gray-500">Description</p>
              <p className="mt-1">{property.description}</p>
            </div>
          )}
        </div>

        {/* Projects Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Projects</h2>
            <button
              onClick={() => setShowAddProject(true)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              + Add Project
            </button>
          </div>

          {/* Add Project Form */}
          {showAddProject && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold mb-4">New Project</h3>
              <form onSubmit={handleAddProject} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Project Name"
                    required
                    value={projectForm.name}
                    onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Description"
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="number"
                      placeholder="Budget (€)"
                      value={projectForm.budget}
                      onChange={(e) => setProjectForm({...projectForm, budget: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <input
                      type="date"
                      value={projectForm.start_date}
                      onChange={(e) => setProjectForm({...projectForm, start_date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Create Project
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddProject(false)}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Projects List */}
          {projects.length > 0 ? (
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{project.name}</h3>
                      {project.description && (
                        <p className="text-gray-600 mt-1">{project.description}</p>
                      )}
                      <div className="flex space-x-4 mt-2 text-sm text-gray-500">
                        <span>Status: <span className="font-medium capitalize">{project.status}</span></span>
                        {project.budget && (
                          <span>Budget: <span className="font-medium">€{project.budget.toLocaleString()}</span></span>
                        )}
                        {project.start_date && (
                          <span>Started: <span className="font-medium">{new Date(project.start_date).toLocaleDateString()}</span></span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-500 hover:text-blue-700 text-sm">Edit</button>
                      <button className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No projects yet. Click "Add Project" to create your first project for this property.
            </p>
          )}
        </div>

        {/* Documents Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold mb-6">Documents</h2>
          
          <div className="mb-6">
            <DocumentUpload 
              propertyId={params.id}
              onUploadComplete={() => setDocumentsRefresh(prev => prev + 1)}
            />
          </div>
          
          <DocumentsList 
            propertyId={params.id}
            refreshTrigger={documentsRefresh}
          />
        </div>
      </main>
    </div>
  )
}
