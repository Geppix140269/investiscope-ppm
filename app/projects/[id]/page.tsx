</div>
        </div>
      </main>
    </div>
  )
}'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DocumentUpload from '@/app/components/DocumentUpload'
import DocumentsList from '@/app/components/DocumentsList'

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const supabase = createClient()
  const [project, setProject] = useState<any>(null)
  const [property, setProperty] = useState<any>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [refreshDocuments, setRefreshDocuments] = useState(0)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_date: ''
  })

  useEffect(() => {
    fetchProjectDetails()
  }, [params.id])

  async function fetchProjectDetails() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    // Fetch project with property info
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('*, properties(id, name, address, city)')
      .eq('id', params.id)
      .single()

    if (projectError || !projectData) {
      router.push('/projects')
      return
    }

    setProject(projectData)
    setProperty(projectData.properties)

    // Fetch tasks
    const { data: tasksData } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', params.id)
      .order('created_at', { ascending: false })

    setTasks(tasksData || [])
    setLoading(false)
  }

  async function handleDeleteProject() {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return
    }

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', params.id)

    if (error) {
      alert('Error deleting project: ' + error.message)
    } else {
      router.push('/projects')
    }
  }

  async function handleStatusChange(newStatus: string) {
    const { error } = await supabase
      .from('projects')
      .update({ status: newStatus })
      .eq('id', params.id)

    if (error) {
      alert('Error updating status: ' + error.message)
    } else {
      setProject({ ...project, status: newStatus })
    }
  }

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        project_id: params.id,
        ...newTask,
        status: 'pending',
        created_by: user.id
      })
      .select()
      .single()

    if (error) {
      alert('Error creating task: ' + error.message)
    } else {
      setTasks([data, ...tasks])
      setNewTask({ title: '', description: '', priority: 'medium', due_date: '' })
      setShowTaskForm(false)
    }
  }

  async function toggleTaskStatus(taskId: string, currentStatus: string) {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed'
    
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', taskId)

    if (error) {
      alert('Error updating task: ' + error.message)
    } else {
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ))
    }
  }

  function calculateProgress() {
    if (project.status === 'completed') return 100
    if (project.status === 'planning') return 0
    
    // Calculate based on tasks completion
    if (tasks.length > 0) {
      const completedTasks = tasks.filter(t => t.status === 'completed').length
      return Math.round((completedTasks / tasks.length) * 100)
    }
    
    // Calculate based on timeline
    if (project.start_date && project.end_date) {
      const start = new Date(project.start_date).getTime()
      const end = new Date(project.end_date).getTime()
      const now = new Date().getTime()
      const progress = ((now - start) / (end - start)) * 100
      return Math.max(0, Math.min(100, Math.round(progress)))
    }
    
    return project.status === 'active' ? 50 : 0
  }

  function calculateBudgetUsed() {
    if (!project.budget) return 0
    return Math.round((project.spent / project.budget) * 100)
  }

  function getStatusColor(status: string) {
    const colors: { [key: string]: string } = {
      planning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      active: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      on_hold: 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  function getPriorityColor(priority: string) {
    const colors: { [key: string]: string } = {
      low: 'text-gray-600',
      medium: 'text-yellow-600',
      high: 'text-orange-600',
      urgent: 'text-red-600'
    }
    return colors[priority] || 'text-gray-600'
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-start">
            <div className="flex items-start space-x-4">
              <Link href="/projects" className="text-gray-500 hover:text-gray-700 mt-1">
                ← Back
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                <p className="text-sm text-gray-600 mt-1">
                  <Link href={`/properties/${property.id}`} className="hover:text-indigo-600">
                    {property.name}
                  </Link>
                  • {property.city}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1).replace('_', ' ')}
              </span>
            </div>
            <div className="flex space-x-2">
              <Link
                href={`/projects/${params.id}/edit`}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Edit Project
              </Link>
              <button
                onClick={handleDeleteProject}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Progress</h3>
            <div className="mt-2">
              <p className="text-2xl font-bold text-gray-900">{calculateProgress()}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-2 rounded-full"
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Budget</h3>
            <p className="text-2xl font-bold text-gray-900">
              €{project.budget?.toLocaleString() || 'N/A'}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Spent: €{project.spent?.toLocaleString() || '0'} ({calculateBudgetUsed()}%)
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Timeline</h3>
            <p className="text-lg font-bold text-gray-900">
              {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'Not set'}
            </p>
            <p className="text-sm text-gray-600">
              to {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'Not set'}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Tasks</h3>
            <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
            <p className="text-sm text-gray-600 mt-1">
              {tasks.filter(t => t.status === 'completed').length} completed
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-indigo-50 to-emerald-50 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
              <strong>Quick Actions:</strong> Update project status
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleStatusChange('planning')}
                className={`px-3 py-1 text-sm rounded-lg ${project.status === 'planning' ? 'bg-yellow-500 text-white' : 'bg-white hover:bg-gray-50'}`}
              >
                Planning
              </button>
              <button
                onClick={() => handleStatusChange('active')}
                className={`px-3 py-1 text-sm rounded-lg ${project.status === 'active' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-50'}`}
              >
                Active
              </button>
              <button
                onClick={() => handleStatusChange('on_hold')}
                className={`px-3 py-1 text-sm rounded-lg ${project.status === 'on_hold' ? 'bg-gray-500 text-white' : 'bg-white hover:bg-gray-50'}`}
              >
                On Hold
              </button>
              <button
                onClick={() => handleStatusChange('completed')}
                className={`px-3 py-1 text-sm rounded-lg ${project.status === 'completed' ? 'bg-green-500 text-white' : 'bg-white hover:bg-gray-50'}`}
              >
                Completed
              </button>
            </div>
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
                onClick={() => setActiveTab('tasks')}
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === 'tasks'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Tasks ({tasks.length})
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
              <button
                onClick={() => setActiveTab('expenses')}
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === 'expenses'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Expenses
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Project Details</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{project.description || 'No description provided.'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Project Information</h3>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Type</dt>
                      <dd className="text-sm text-gray-900 capitalize">{project.metadata?.project_type || 'Not specified'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Priority</dt>
                      <dd className={`text-sm font-medium capitalize ${getPriorityColor(project.metadata?.priority || 'medium')}`}>
                        {project.metadata?.priority || 'Medium'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Created</dt>
                      <dd className="text-sm text-gray-900">{new Date(project.created_at).toLocaleDateString()}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                      <dd className="text-sm text-gray-900">{new Date(project.updated_at).toLocaleDateString()}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}

            {/* Tasks Tab */}
            {activeTab === 'tasks' && (
              <div>
                <div className="mb-4 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Project Tasks</h3>
                  <button
                    onClick={() => setShowTaskForm(!showTaskForm)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Task
                  </button>
                </div>

                {showTaskForm && (
                  <form onSubmit={handleCreateTask} className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="space-y-4">
                      <div>
                        <input
                          type="text"
                          placeholder="Task title..."
                          value={newTask.title}
                          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <textarea
                          placeholder="Description (optional)"
                          value={newTask.description}
                          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <select
                          value={newTask.priority}
                          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                          className="px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="low">Low Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="high">High Priority</option>
                          <option value="urgent">Urgent</option>
                        </select>
                        <input
                          type="date"
                          value={newTask.due_date}
                          onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                          className="px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Create Task
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowTaskForm(false)}
                          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {tasks.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No tasks yet. Add your first task!</p>
                ) : (
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              checked={task.status === 'completed'}
                              onChange={() => toggleTaskStatus(task.id, task.status)}
                              className="mt-1 h-4 w-4 text-indigo-600 rounded"
                            />
                            <div className={task.status === 'completed' ? 'line-through text-gray-500' : ''}>
                              <h4 className="font-medium text-gray-900">{task.title}</h4>
                              {task.description && (
                                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                              )}
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span className={`font-medium ${getPriorityColor(task.priority)}`}>
                                  {task.priority} priority
                                </span>
                                {task.due_date && (
                                  <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                                )}
                              </div>
                            </div>
                          </div>
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
                    propertyId={property.id}
                    projectId={params.id}
                    onUploadComplete={() => setRefreshDocuments(prev => prev + 1)}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Project Documents</h3>
                  <DocumentsList
                    propertyId={property.id}
                    projectId={params.id}
                    refreshTrigger={refreshDocuments}
                  />
                </div>
              </div>
            )}

            {/* Expenses Tab */}
            {activeTab === 'expenses' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Budget Overview</h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Budget</p>
                        <p className="text-2xl font-bold text-gray-900">
                          €{project.budget?.toLocaleString() || '0'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Spent</p>
                        <p className="text-2xl font-bold text-gray-900">
                          €{project.spent?.toLocaleString() || '0'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Remaining</p>
                        <p className="text-2xl font-bold text-green-600">
                          €{((project.budget || 0) - (project.spent || 0)).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className={`h-4 rounded-full ${
                            calculateBudgetUsed() > 90 ? 'bg-red-500' : 
                            calculateBudgetUsed() > 75 ? 'bg-yellow-500' : 
                            'bg-green-500'
                          }`}
                          style={{ width: `${calculateBudgetUsed()}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{calculateBudgetUsed()}% of budget used</p>
                    </div>
                  </div>
                </div>

                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Expense Tracking Coming Soon</h3>
                  <p className="text-gray-600 mb-4">Track invoices, receipts, and detailed expenses</p>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700">
                    Get Notified When Available
                  </button>
                </div>
              </div>
            )}
