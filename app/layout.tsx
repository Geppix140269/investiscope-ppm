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
      <head>
        <style>{`
          * {
            box-sizing: border-box;
            padding: 0;
            margin: 0;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
              Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
            background: #f5f5f5;
          }
          
          a {
            color: inherit;
            text-decoration: none;
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
