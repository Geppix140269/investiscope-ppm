import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">InvestiScope PPM</h1>
        <p className="text-xl text-gray-600 mb-8">Property Project Management System</p>
        <div className="space-x-4">
          <Link 
            href="/login" 
            className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Login
          </Link>
          <Link 
            href="/register" 
            className="inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  )
}
