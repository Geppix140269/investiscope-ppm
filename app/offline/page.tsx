// app/offline/page.tsx
export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-emerald-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-emerald-600 rounded-full mx-auto flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">You&apos;re Offline</h1>
        <p className="text-gray-600 mb-8">
          Don&apos;t worry! Your work is saved locally and will sync when you&apos;re back online.
        </p>
        
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-4 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">What you can do offline:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• View cached properties and projects</li>
              <li>• Read previously loaded documents</li>
              <li>• Plan your next tasks</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">What needs internet:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Creating new properties or projects</li>
              <li>• Uploading documents</li>
              <li>• Inviting team members</li>
            </ul>
          </div>
        </div>
        
        <button
          onClick={() => window.location.reload()}
          className="mt-8 bg-gradient-to-r from-indigo-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
