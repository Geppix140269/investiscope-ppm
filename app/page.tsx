export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: 'bold',
          marginBottom: '1rem',
          color: '#333'
        }}>
          InvestiScope PPM
        </h1>
        <p style={{ 
          fontSize: '1.5rem',
          color: '#666',
          marginBottom: '2rem'
        }}>
          Property Project Management System
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a 
            href="/login" 
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              fontWeight: 'bold',
              display: 'inline-block'
            }}
          >
            Login
          </a>
          <a 
            href="/register" 
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              fontWeight: 'bold',
              display: 'inline-block'
            }}
          >
            Register
          </a>
        </div>
      </div>
    </main>
  )
}
