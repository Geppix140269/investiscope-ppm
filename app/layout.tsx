// File: app/layout.tsx
// FIXED VERSION - Removed footer that was appearing on all pages

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './global.css'
import Navigation from './components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'InvestiScope PPM - Property Project Management for Puglia',
  description: 'Professional property project management platform for international investors in Puglia, Italy. Track properties, manage renovations, and maximize Mini PIA grants.',
  keywords: 'property management puglia, italian property investment, mini pia grants, puglia real estate, property project management',
  authors: [{ name: 'InvestiScope' }],
  openGraph: {
    title: 'InvestiScope PPM - Property Project Management',
    description: 'Manage your Puglia property investments with professional tools and grant integration',
    url: 'https://ppm.investiscope.net',
    siteName: 'InvestiScope PPM',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'InvestiScope Property Project Management',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InvestiScope PPM - Property Project Management',
    description: 'Professional tools for Puglia property investors',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#6366f1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {/* Navigation */}
        <Navigation />
        
        {/* Main Content - Added pt-16 to account for fixed navigation */}
        <main className="min-h-screen pt-16">
          {children}
        </main>
        
        {/* Footer removed - it should only be on specific pages like home, not global */}
        
        {/* Scripts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Add smooth scroll behavior
              document.documentElement.style.scrollBehavior = 'smooth';
              
              // Add loading animation
              window.addEventListener('load', function() {
                document.body.classList.add('loaded');
              });
            `,
          }}
        />
      </body>
    </html>
  )
}
