'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FileText, Euro, TrendingUp, Download, Calendar, Filter } from 'lucide-react'

interface Expense {
  id: string
  project_id: string
  document_id?: string
  category: string
  description: string
  amount: number
  currency: string
  date: string
  vendor?: string
  invoice_number?: string
  payment_status: 'pending' | 'paid' | 'overdue'
  extracted_from_document?: boolean
  created_at: string
  updated_at: string
}

interface ExpenseTrackerProps {
  projectId: string
  propertyId: string
}

export default function ExpenseTracker({ projectId, propertyId }: ExpenseTrackerProps) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const supabase = createClient()

  // Form state for manual expense entry
  const [formData, setFormData] = useState({
    category: 'materials',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    vendor: '',
    invoice_number: '',
    payment_status: 'pending' as const
  })

  useEffect(() => {
    fetchExpenses()
  }, [projectId])

  async function fetchExpenses() {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('project_id', projectId)
      .order('date', { ascending: false })

    if (error) {
      console.error('Error fetching expenses:', error)
    } else {
      setExpenses(data || [])
    }
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    const { error } = await supabase
      .from('expenses')
      .insert({
        project_id: projectId,
        category: formData.category,
        description: formData.description,
        amount: parseFloat(formData.amount),
        currency: 'EUR',
        date: formData.date,
        vendor: formData.vendor || null,
        invoice_number: formData.invoice_number || null,
        payment_status: formData.payment_status,
        extracted_from_document: false
      })

    if (error) {
      alert('Error adding expense: ' + error.message)
    } else {
      setShowAddForm(false)
      setFormData({
        category: 'materials',
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        vendor: '',
        invoice_number: '',
        payment_status: 'pending'
      })
      fetchExpenses()
    }
  }

  async function updatePaymentStatus(expenseId: string, status: 'pending' | 'paid' | 'overdue') {
    const { error } = await supabase
      .from('expenses')
      .update({ payment_status: status })
      .eq('id', expenseId)

    if (error) {
      alert('Error updating payment status: ' + error.message)
    } else {
      fetchExpenses()
    }
  }

  async function deleteExpense(expenseId: string) {
    if (!confirm('Are you sure you want to delete this expense?')) return

    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', expenseId)

    if (error) {
      alert('Error deleting expense: ' + error.message)
    } else {
      fetchExpenses()
    }
  }

  // Calculate totals
  const totals = expenses.reduce((acc, expense) => {
    acc.total += expense.amount
    acc[expense.payment_status] += expense.amount
    return acc
  }, { total: 0, paid: 0, pending: 0, overdue: 0 })

  // Filter expenses
  const filteredExpenses = expenses.filter(expense => {
    if (filter !== 'all' && expense.payment_status !== filter) return false
    
    if (dateRange.start && expense.date < dateRange.start) return false
    if (dateRange.end && expense.date > dateRange.end) return false
    
    return true
  })

  // Export to CSV
  function exportToCSV() {
    const headers = ['Date', 'Category', 'Description', 'Vendor', 'Invoice', 'Amount (EUR)', 'Status']
    const rows = filteredExpenses.map(e => [
      e.date,
      e.category,
      e.description,
      e.vendor || '',
      e.invoice_number || '',
      e.amount.toFixed(2),
      e.payment_status
    ])
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `expenses-${projectId}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const categoryIcons: { [key: string]: string } = {
    materials: '🧱',
    labor: '👷',
    permits: '📋',
    professional: '💼',
    utilities: '💡',
    equipment: '🔧',
    other: '📌'
  }

  if (loading) return <div>Loading expenses...</div>

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">€{totals.total.toLocaleString()}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <Euro className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Paid</p>
              <p className="text-2xl font-bold text-green-600">€{totals.paid.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">€{totals.pending.toLocaleString()}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Overdue</p>
              <p className="text-2xl font-bold text-red-600">€{totals.overdue.toLocaleString()}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
            >
              <span className="text-lg">+</span>
              Add Expense
            </button>
            
            <button
              onClick={exportToCSV}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>

            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Start date"
            />

            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-md"
              placeholder="End date"
            />
          </div>
        </div>
      </div>

      {/* Add Expense Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Add New Expense</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="materials">Materials</option>
                <option value="labor">Labor</option>
                <option value="permits">Permits</option>
                <option value="professional">Professional Fees</option>
                <option value="utilities">Utilities</option>
                <option value="equipment">Equipment</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vendor
              </label>
              <input
                type="text"
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invoice Number
              </label>
              <input
                type="text"
                value={formData.invoice_number}
                onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Status
              </label>
              <select
                value={formData.payment_status}
                onChange={(e) => setFormData({ ...formData, payment_status: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            <div className="md:col-span-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Add Expense
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Expenses List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vendor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  No expenses found. Add your first expense to start tracking costs.
                </td>
              </tr>
            ) : (
              filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{categoryIcons[expense.category] || '📌'}</span>
                      <span className="capitalize">{expense.category}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {expense.description}
                    {expense.extracted_from_document && (
                      <span className="ml-2 text-xs text-blue-600" title="Extracted from document">
                        🤖
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {expense.vendor || '-'}
                    {expense.invoice_number && (
                      <div className="text-xs text-gray-500">#{expense.invoice_number}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    €{expense.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={expense.payment_status}
                      onChange={(e) => updatePaymentStatus(expense.id, e.target.value as any)}
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        expense.payment_status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : expense.payment_status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Budget Progress */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Budget Progress</h3>
        <div className="space-y-4">
          {Object.entries(
            filteredExpenses.reduce((acc, expense) => {
              if (!acc[expense.category]) {
                acc[expense.category] = 0
              }
              acc[expense.category] += expense.amount
              return acc
            }, {} as { [key: string]: number })
          ).map(([category, amount]) => (
            <div key={category}>
              <div className="flex justify-between text-sm mb-1">
                <span className="capitalize flex items-center gap-2">
                  <span className="text-lg">{categoryIcons[category] || '📌'}</span>
                  {category}
                </span>
                <span className="font-medium">€{amount.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${Math.min((amount / totals.total) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
