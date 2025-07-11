'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkUserAndFetchData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
        
        // Fetch properties
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching properties:', error)
        } else {
          setProperties(data || [])
        }
      }
      setLoading(false)
    }

    checkUserAndFetchData()
  }, [router, supabase])

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  function calculateTotalInvestment() {
    return properties.reduce((sum, property) => sum + (property.purchase_price || 0), 0)
  }

  function calculateTotalValue() {
    return properties.reduce((sum, property) => sum + (property.current_value || property.purchase_price || 0), 0)
  }

  function formatPropertyType(type: string) {
    const types: { [key: string]: string } = {
      'apartment': 'Appartamento',
      'house': 'Casa/Villa',
      'commercial': 'Commerciale',
      'land': 'Terreno'
    }
    return types[type] || type
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Caricamento...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">InvestiScope Italia</h1>
              <p className="text-sm text-gray-600">Gestione Proprietà Immobiliari in Italia</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user?.email}</span>
              <button
                onClick={signOut}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Esci
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Le Tue Proprietà in Italia</h2>
          
          {/* Add Property Button */}
          <Link 
            href="/properties/new"
            className="inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-6"
          >
            + Aggiungi Nuova Proprietà
          </Link>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.length > 0 ? (
              properties.map((property) => (
                <div key={property.id} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-2">{property.name}</h3>
                  <p className="text-gray-600 mb-2">{property.address}</p>
                  <p className="text-gray-600 mb-4">
                    {property.city} {property.postal_code && `${property.postal_code}`}
                    <span className="text-xs text-gray-500 ml-2">Italia</span>
                  </p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tipologia:</span>
                      <span className="capitalize">{formatPropertyType(property.property_type)}</span>
                    </div>
                    {property.size_sqm && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Superficie:</span>
                        <span>{property.size_sqm} m²</span>
                      </div>
                    )}
                    {property.purchase_price && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Prezzo Acquisto:</span>
                        <span className="font-semibold">€{property.purchase_price.toLocaleString('it-IT')}</span>
                      </div>
                    )}
                    {property.energy_class && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Classe Energetica:</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          {property.energy_class}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Link 
                      href={`/properties/${property.id}`}
                      className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                    >
                      Vedi Dettagli →
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                <p>Nessuna proprietà aggiunta. Clicca &quot;Aggiungi Nuova Proprietà&quot; per iniziare!</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Totale Proprietà</h3>
            <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Progetti Attivi</h3>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Investimento Totale</h3>
            <p className="text-2xl font-bold text-gray-900">€{calculateTotalInvestment().toLocaleString('it-IT')}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Valore Portfolio</h3>
            <p className="text-2xl font-bold text-gray-900">€{calculateTotalValue().toLocaleString('it-IT')}</p>
          </div>
        </div>

        {/* Quick Links for Italian Property Management */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risorse Utili per Investitori</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded p-4">
              <h4 className="font-medium mb-2">📋 Documenti Necessari</h4>
              <p className="text-sm text-gray-600">Checklist completa per l&apos;acquisto immobiliare in Italia</p>
            </div>
            <div className="bg-white rounded p-4">
              <h4 className="font-medium mb-2">🏛️ Permessi e Pratiche</h4>
              <p className="text-sm text-gray-600">Gestione SCIA, CILA, e Permessi di Costruire</p>
            </div>
            <div className="bg-white rounded p-4">
              <h4 className="font-medium mb-2">👥 Professionisti</h4>
              <p className="text-sm text-gray-600">Geometri, Notai, e Imprese nella tua zona</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
