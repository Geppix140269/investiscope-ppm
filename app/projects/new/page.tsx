'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewProjectPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [properties, setProperties] = useState<any[]>([])
  const [formData, setFormData] = useState({
    property_id: '',
    name: '',
    description: '',
    status: 'planning',
    budget: '',
    start_date: '',
    end_date: '',
    project_type: 'renovation',
    priority: 'medium',
    grant_type: 'none',
    country: 'IT'
  })

  useEffect(() => {
    checkUserAndFetchProperties()
  }, [])

  async function checkUserAndFetchProperties() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    
    const { data, error } = await supabase
      .from('properties')
      .select('id, name, address, city')
      .order('name')

    if (error) {
      console.error('Error fetching properties:', error)
    } else {
      setProperties(data || [])
      // If there's only one property, pre-select it
      if (data && data.length === 1) {
        setFormData(prev => ({ ...prev, property_id: data[0].id }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    // Prepare the data for insertion
    const projectData = {
      ...formData,
      user_id: user.id,
      budget: formData.budget ? parseFloat(formData.budget) : null,
      spent: 0,
      metadata: {
        project_type: formData.project_type,
        priority: formData.priority,
        grant_type: formData.grant_type,
        country: formData.country,
        created_by: user.email
      }
    }

    const { data, error } = await supabase
      .from('projects')
      .insert(projectData)
      .select()
      .single()

    if (error) {
      alert('Error creating project: ' + error.message)
      setLoading(false)
    } else {
      router.push(`/projects/${data.id}`)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const projectTypes = [
    { value: 'renovation', label: 'Full Renovation', icon: '🏗️' },
    { value: 'maintenance', label: 'Maintenance', icon: '🔧' },
    { value: 'improvement', label: 'Home Improvement', icon: '🏡' },
    { value: 'repair', label: 'Repair Work', icon: '🔨' },
    { value: 'landscaping', label: 'Landscaping', icon: '🌳' },
    { value: 'energy', label: 'Energy Efficiency', icon: '⚡' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/projects" 
            className="text-gray-500 hover:text-gray-700 inline-flex items-center mb-4"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Projects
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
          <p className="text-gray-600 mt-2">Start a new renovation or maintenance project for your property</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Property Selection */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Property</h2>
            
            {properties.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-4">You need to add a property first</p>
                <Link
                  href="/properties/new"
                  className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Property
                </Link>
              </div>
            ) : (
              <select
                name="property_id"
                required
                value={formData.property_id}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Choose a property...</option>
                {properties.map(property => (
                  <option key={property.id} value={property.id}>
                    {property.name} - {property.address}, {property.city}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Project Details */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Kitchen Renovation, Roof Repair"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {projectTypes.map(type => (
                    <label
                      key={type.value}
                      className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.project_type === type.value
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="project_type"
                        value={type.value}
                        checked={formData.project_type === type.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className="text-2xl mr-3">{type.icon}</span>
                      <span className="text-sm font-medium">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Describe the scope of work, objectives, and any special requirements..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="planning">Planning</option>
                    <option value="active">Active</option>
                    <option value="on_hold">On Hold</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Budget & Timeline */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Budget & Timeline</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Budget (€)
                </label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter total budget"
                  step="0.01"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    min={formData.start_date}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              {formData.start_date && formData.end_date && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Duration:</strong> {
                      Math.ceil((new Date(formData.end_date).getTime() - new Date(formData.start_date).getTime()) / (1000 * 60 * 60 * 24))
                    } days
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Grant/Funding Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Grants & Funding</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Are you applying for any grants?
                </label>
                <select
                  name="grant_type"
                  value={formData.grant_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="none">No grants</option>
                  <option value="mini_pia">Mini PIA (Puglia, Italy)</option>
                  <option value="superbonus">Superbonus 110% (Italy)</option>
                  <option value="ecobonus">Ecobonus (Italy)</option>
                  <option value="renovation_bonus">Renovation Bonus (Italy)</option>
                  <option value="eu_funds">EU Regional Development Funds</option>
                  <option value="other">Other Grant Program</option>
                </select>
              </div>

              {formData.grant_type !== 'none' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="flex items-center gap-2 font-medium text-yellow-800 mb-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Grant Documentation Requirements
                  </h4>
                  <p className="text-sm text-yellow-700 mb-2">
                    You&apos;ll need to maintain proper documentation for grant compliance.
                  </p>
                  <Link
                    href="https://investiscope.net/calculator"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-yellow-800 font-medium hover:text-yellow-900"
                  >
                    Calculate potential grant amount →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-between items-center">
            <Link
              href="/projects"
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancel
            </Link>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.push('/projects')}
                className="px-6 py-3 border-2 border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Save as Draft
              </button>
              <button
                type="submit"
                disabled={loading || !formData.property_id || !formData.name}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  'Create Project'
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Tips Section */}
        <div className="mt-12 bg-gradient-to-r from-indigo-50 to-emerald-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-3">💡 Project Management Tips</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-indigo-500 mr-2">•</span>
              Break down large renovations into multiple smaller projects for better tracking
            </li>
            <li className="flex items-start">
              <span className="text-indigo-500 mr-2">•</span>
              Set realistic timelines with buffer time for unexpected delays
            </li>
            <li className="flex items-start">
              <span className="text-indigo-500 mr-2">•</span>
              Include a 10-20% contingency in your budget for unforeseen costs
            </li>
            <li className="flex items-start">
              <span className="text-indigo-500 mr-2">•</span>
              Document everything with photos and receipts for grant applications
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
