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
