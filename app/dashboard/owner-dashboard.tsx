// File: app/dashboard/owner-dashboard.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { 
  Home, TrendingUp, Euro, FileText, Users, Calendar,
  AlertCircle, CheckCircle, Clock, Plus, ArrowRight
} from 'lucide-react'

interface DashboardProps {
  user: any
}

export default function OwnerDashboard({ user }: DashboardProps) {
  const [properties, setProperties] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchOwnerData()
  }, [])

  async function fetchOwnerData() {
    // Fetch owned properties
    const { data: props } = await supabase
      .from('properties')
      .select('*')
      .or('status.is.null,status.eq.owned')
      .order('created_at', { ascending: false })

    // Fetch projects
    const { data: projs } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    if (props) setProperties(props)
    if (projs) setProjects(projs)
    
    setLoading(false)
  }

  const totalInvestment = properties.reduce((sum, p) => sum + (p.purchase_price || 0), 0)
  const totalCurrentValue = properties.reduce((sum, p) => sum + (p.current_value || p.purchase_price || 0), 0)
  const activeProjects = projects.filter(p => p.status === 'active').length
  const totalProjectBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0)

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-light text-gray-900 mb-2">
          Welcome back, {user.email?.split('@')[0]}!
        </h1>
        <p className="text-gray-600">
          Managing {properties.length} {properties.length === 1 ? 'property' : 'properties'} in Italy
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <Home className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-sm text-gray-500">Portfolio</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
          <p className="text-sm text-gray-600">Properties</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-emerald-100 p-3 rounded-lg">
              <Euro className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-sm text-gray-500">Value</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">€{totalCurrentValue.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Current Value</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">ROI</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {totalInvestment > 0 
              ? `${Math.round(((totalCurrentValue - totalInvestment) / totalInvestment) * 100)}%`
              : '0%'
            }
          </p>
          <p className="text-sm text-gray-600">Total Return</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Active</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{activeProjects}</p>
          <p className="text-sm text-gray-600">Projects</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Properties List */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Properties</h2>
            <Link
              href="/properties/new"
              className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add Property
            </Link>
          </div>

          {properties.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">No properties yet</h3>
              <p className="text-gray-600 mb-4">Add your first property to start tracking</p>
              <Link
                href="/properties/new"
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Property
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {properties.map((property) => (
                <div key={property.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{property.name}</h3>
                      <p className="text-gray-600">{property.address}, {property.city}</p>
                    </div>
                    <Link
                      href={`/properties/${property.id}`}
                      className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                    >
                      View Details →
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Purchase Price</p>
                      <p className="font-semibold">€{property.purchase_price?.toLocaleString() || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Current Value</p>
                      <p className="font-semibold">€{(property.current_value || property.purchase_price)?.toLocaleString() || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Type</p>
                      <p className="font-semibold capitalize">{property.property_type || 'Property'}</p>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Link
                      href={`/properties/${property.id}/projects/new`}
                      className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      + New Project
                    </Link>
                    <Link
                      href={`/properties/${property.id}/edit`}
                      className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Edit Property
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Recent Projects */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Projects</h2>
              <Link
                href="/projects"
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                View All →
              </Link>
            </div>
            
            {projects.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                <FileText className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 text-sm">No active projects</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm divide-y">
                {projects.slice(0, 3).map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="block p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-gray-900">{project.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        project.status === 'active' 
                          ? 'bg-blue-100 text-blue-700'
                          : project.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Budget: €{project.budget?.toLocaleString() || '0'}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                href="/documents"
                className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">Documents</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </Link>
              
              <Link
                href="/team"
                className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">Team</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </Link>
              
              <Link
                href="/expenses"
                className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <Euro className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">Expenses</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </Link>
            </div>
          </div>

          {/* Upgrade CTA for Owners */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
            <h3 className="font-semibold text-gray-900 mb-2">Maximize Your Investment</h3>
            <p className="text-sm text-gray-600 mb-4">
              Get professional tools for renovation management, grant applications, and team collaboration.
            </p>
            <Link
              href="/pricing"
              className="block w-full text-center bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Upgrade to Owner Plan
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
