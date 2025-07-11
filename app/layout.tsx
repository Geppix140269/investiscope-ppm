import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './global.css'
import Navigation from './components/Navigation'
import PWAInstallBanner, { OnlineStatusIndicator } from './components/PWAInstallBanner'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#6366f1'
}

export const metadata: Metadata = {
  metadataBase: new URL('https://investiscope.net'),
  title: 'InvestiScope PPM - Property Project Management for Puglia',
  description: 'Professional property project management platform for international investors in Puglia, Italy. Track properties, manage renovations, and maximize Mini PIA grants.',
  keywords: 'property management puglia, italian property investment, mini pia grants, puglia real estate, property project management',
  authors: [{ name: 'InvestiScope' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'InvestiScope PPM'
  },
  formatDetection: {
    telephone: false
  },
  openGraph: {
    title: 'InvestiScope PPM - Property Project Management',
    description: 'Manage your Puglia property investments with professional tools and grant integration',
    url: 'https://investiscope.net',
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
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="InvestiScope PPM" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="InvestiScope" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* iOS Splash Screens */}
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icon-152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-180.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icon-167.png" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {/* Navigation */}
        <Navigation />
        
        {/* Online Status Indicator */}
        <OnlineStatusIndicator />
        
        {/* Main Content - Added pt-16 to account for fixed navigation */}
        <main className="min-h-screen pt-16">
          {children}
        </main>
        
        {/* PWA Install Banner */}
        <PWAInstallBanner />
      </body>
    </html>
  )
}
