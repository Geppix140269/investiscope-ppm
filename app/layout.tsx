import './globals.css'

export const metadata = {
  title: 'InvestiScope PPM',
  description: 'Property Project Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
