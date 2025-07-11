'use client'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Offline</h1>
        <p className="text-gray-600 mb-8">Please check your internet connection.</p>
        <a href="/" className="text-blue-600 hover:text-blue-800">Go to Home</a>
      </div>
    </div>
  )
}
