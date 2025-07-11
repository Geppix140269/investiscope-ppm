// app/projects/new/page.tsx
// Updated with project templates - FIXED SYNTAX ERROR

'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { projectTemplates, getProjectTemplate, calculateEndDate, generateTasksFromTemplate } from '@/lib/projectTemplates'

export default function NewProjectPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [properties, setProperties] = useState<any[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
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

  useEffect(() => {
    // Update form when template is selected
    if (selectedTemplate) {
      const template = getProjectTemplate(selectedTemplate)
      if (template) {
        setFormData(prev => ({
          ...prev,
          name: template.name,
          description: template.description,
          project_type: template.category,
          budget: template.budgetRange.min.toString(),
          end_date: prev.start_date ? calculateEndDate(prev.start_date, template.estimatedDuration) : ''
        }))
      }
    }
  }, [selectedTemplate])

  useEffect(() => {
    // Update end date when start date changes
    if (formData.start_date && selectedTemplate) {
      const template = getProjectTemplate(selectedTemplate)
      if (template) {
        setFormData(prev => ({
          ...prev,
          end_date: calculateEndDate(prev.start_date, template.estimatedDuration)
        }))
      }
    }
  }, [formData.start_date, selectedTemplate])

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

    // Create project
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
        template_used: selectedTemplate,
        created_by: user.email
      }
    }

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert(projectData)
      .select()
      .single()

    if (projectError) {
      alert('Error creating project: ' + projectError.message)
      setLoading(false)
      return
    }

    // If template was used, create tasks
    if (selectedTemplate && project) {
      const template = getProjectTemplate(selectedTemplate)
      if (template) {
        const tasks = generateTasksFromTemplate(template, formData.start_date || new Date().toISOString().split('T')[0])
        
        const tasksToInsert = tasks.map(task => ({
          ...task,
          project_id: project.id,
          created_by: user.id
        }))

        const { error: tasksError } = await supabase
          .from('tasks')
          .insert(tasksToInsert)

        if (tasksError) {
          console.error('Error creating tasks:', tasksError)
        }
      }
    }

    router.push(`/projects/${project.id}`)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
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
          <p className="text-gray-600 mt-2">Start with a template or create a custom project</p>
        </div>

        {/* Template Selection */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose a Template (Optional)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setSelectedTemplate(null)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                selectedTemplate === null
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">✨</div>
              <h3 className="font-semibold text-gray-900">Custom Project</h3>
              <p className="text-sm text-gray-600">Start from scratch</p>
            </button>

            {projectTemplates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => setSelectedTemplate(template.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  selectedTemplate === template.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">{template.icon}</div>
                <h3 className="font-semibold text-gray-900">{template.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{template.estimatedDuration} days • €{template.budgetRange.min.toLocaleString()}-{template.budgetRange.max.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{template.tasks.length} tasks included</p>
              </button>
            ))}
          </div>
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
                {selectedTemplate && (
                  <p className="text-sm text-gray-500 mt-1">
                    Template suggests: €{getProjectTemplate(selectedTemplate)?.budgetRange.min.toLocaleString()} - €{getProjectTemplate(selectedTemplate)?.budgetRange.max.toLocaleString()}
                  </p>
                )}
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
                  {selectedTemplate && (
                    <p className="text-sm text-gray-500 mt-1">
                      Template duration: {getProjectTemplate(selectedTemplate)?.estimatedDuration} days
                    </p>
                  )}
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

          {/* Template Preview */}
          {selectedTemplate && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Template Tasks Preview</h2>
              <p className="text-sm text-gray-600 mb-4">
                These tasks will be automatically created for your project:
              </p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {getProjectTemplate(selectedTemplate)?.tasks.map((task, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <p className="text-sm text-gray-600">{task.description}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.priority}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{task.estimatedDays} days</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
      </div>
    </div>
  )
}
