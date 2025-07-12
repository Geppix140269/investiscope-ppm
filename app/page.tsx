'use client'

import Link from 'next/link'
import { ArrowRight, Check, Shield, Users, TrendingUp, Clock, Award, Globe } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Clean and Professional */}
      <section className="relative overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50"></div>
        
        {/* Professional grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239CA3AF" fill-opacity="0.03"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        
        <div className="relative">
          {/* Navigation Bar */}
          <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-gray-900">InvestiScope PPM</h1>
                </div>
                <div className="hidden md:flex items-center space-x-8">
                  <Link href="#features" className="text-gray-600 hover:text-gray-900 font-medium">Features</Link>
                  <Link href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium">Pricing</Link>
                  <Link href="#about" className="text-gray-600 hover:text-gray-900 font-medium">About</Link>
                  <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">Sign In</Link>
                  <Link href="/register" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-24 lg:py-32">
            <div className="max-w-3xl">
              {/* Trust Badge */}
              <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Shield className="w-4 h-4" />
                <span>Trusted by 500+ Property Investors in Italy</span>
              </div>
              
              {/* Main Heading */}
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Professional Property Management for{' '}
                <span className="text-indigo-600">Puglia Investors</span>
              </h1>
              
              {/* Subheading */}
              <p className="text-xl text-gray-600 leading-relaxed mb-10 max-w-2xl">
                Streamline your Italian property portfolio with enterprise-grade project management, 
                real-time collaboration, and integrated grant tracking—designed specifically for international investors.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link 
                  href="/register"
                  className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                >
                  Start Free 14-Day Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link 
                  href="/demo"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all"
                >
                  Watch Demo
                  <span className="ml-2 text-gray-400">3 min</span>
                </Link>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>GDPR compliant</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-12 border-y border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">€45M+</div>
              <div className="text-sm text-gray-600 mt-1">Property Value Managed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">2,500+</div>
              <div className="text-sm text-gray-600 mt-1">Active Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">€3.2M</div>
              <div className="text-sm text-gray-600 mt-1">Grants Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">98%</div>
              <div className="text-sm text-gray-600 mt-1">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Tools Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span>🔗</span>
              <span>INTEGRATED TOOLS</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Complete Investment Suite at Your Fingertips
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access our full range of property investment tools directly from your dashboard
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Grant Calculator */}
            <a 
              href="https://investiscopeeasy.netlify.app/app.html"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl shadow-sm border border-gray-200 p-8 hover:shadow-xl hover:border-indigo-200 transition-all transform hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🧮</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Grant Calculator</h3>
              <p className="text-gray-600 mb-4">
                Calculate Mini PIA grants up to €2.25M instantly. Check eligibility and estimate funding for your Puglia projects.
              </p>
              <div className="flex items-center text-indigo-600 font-medium">
                Open Calculator
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
            
            {/* Property Survey */}
            <a 
              href="https://investiscope-nextjs.netlify.app/surveys"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl shadow-sm border border-gray-200 p-8 hover:shadow-xl hover:border-indigo-200 transition-all transform hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Property Survey</h3>
              <p className="text-gray-600 mb-4">
                Order professional property surveys and technical assessments. Essential for grant applications and renovations.
              </p>
              <div className="flex items-center text-emerald-600 font-medium">
                Order Survey
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
            
            {/* ROI Analysis */}
            <a 
              href="https://investiscope-nextjs.netlify.app/classic/register"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl shadow-sm border border-gray-200 p-8 hover:shadow-xl hover:border-indigo-200 transition-all transform hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">ROI Analysis</h3>
              <p className="text-gray-600 mb-4">
                Advanced ROI projections and investment analysis. Model different scenarios and optimize your returns.
              </p>
              <div className="flex items-center text-orange-600 font-medium">
                Analyze ROI
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          </div>
          
          {/* Integration Notice */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-6 py-3 rounded-full">
              <Check className="w-5 h-5" />
              <span className="font-medium">All tools integrate seamlessly with your PPM dashboard</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Properties in Italy
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Purpose-built for international investors navigating Italian property regulations, grants, and renovations
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group">
              <div className="bg-white border border-gray-200 rounded-xl p-8 h-full hover:border-indigo-200 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                  <Globe className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Multi-Property Portfolio</h3>
                <p className="text-gray-600 mb-4">
                  Manage unlimited properties across Puglia with detailed tracking of purchases, renovations, and valuations.
                </p>
                <Link href="/features/portfolio" className="text-indigo-600 font-medium inline-flex items-center group-hover:text-indigo-700">
                  Learn more <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group">
              <div className="bg-white border border-gray-200 rounded-xl p-8 h-full hover:border-indigo-200 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-6">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Project & Budget Tracking</h3>
                <p className="text-gray-600 mb-4">
                  Real-time project management with Gantt charts, budget tracking, and automatic expense categorization.
                </p>
                <Link href="/features/projects" className="text-indigo-600 font-medium inline-flex items-center group-hover:text-indigo-700">
                  Learn more <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group">
              <div className="bg-white border border-gray-200 rounded-xl p-8 h-full hover:border-indigo-200 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Grant Management</h3>
                <p className="text-gray-600 mb-4">
                  Track Mini PIA and other Italian grants with compliance monitoring and document requirements.
                </p>
                <Link href="/features/grants" className="text-indigo-600 font-medium inline-flex items-center group-hover:text-indigo-700">
                  Learn more <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group">
              <div className="bg-white border border-gray-200 rounded-xl p-8 h-full hover:border-indigo-200 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Team Collaboration</h3>
                <p className="text-gray-600 mb-4">
                  Invite architects, contractors, and property managers with role-based permissions and real-time updates.
                </p>
                <Link href="/features/team" className="text-indigo-600 font-medium inline-flex items-center group-hover:text-indigo-700">
                  Learn more <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="group">
              <div className="bg-white border border-gray-200 rounded-xl p-8 h-full hover:border-indigo-200 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Document Vault</h3>
                <p className="text-gray-600 mb-4">
                  Secure storage for contracts, permits, invoices with AI-powered categorization and search.
                </p>
                <Link href="/features/documents" className="text-indigo-600 font-medium inline-flex items-center group-hover:text-indigo-700">
                  Learn more <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="group">
              <div className="bg-white border border-gray-200 rounded-xl p-8 h-full hover:border-indigo-200 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                  <Clock className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-time Updates</h3>
                <p className="text-gray-600 mb-4">
                  Live notifications, activity feeds, and presence indicators keep your team synchronized.
                </p>
                <Link href="/features/realtime" className="text-indigo-600 font-medium inline-flex items-center group-hover:text-indigo-700">
                  Learn more <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 lg:p-12">
              <div className="flex items-start space-x-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-2xl font-medium text-gray-900 mb-6">
                "InvestiScope PPM transformed how we manage our Puglia properties. The grant tracking alone saved us €120,000 in missed opportunities. 
                It's an essential tool for any serious investor in Italian real estate."
              </blockquote>
              <div className="flex items-center">
                <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xl font-semibold text-gray-600">SM</span>
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-gray-900">Sarah Mitchell</div>
                  <div className="text-gray-600">Property Investor, London</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Property Management?
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Join hundreds of international investors who trust InvestiScope PPM for their Italian property portfolios.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-50 transition-all shadow-lg"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-400 transition-all"
            >
              Talk to Sales
            </Link>
          </div>
          <p className="mt-8 text-indigo-200">
            Free 14-day trial • No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-3 text-gray-600">
                <li><Link href="/features" className="hover:text-gray-900">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-gray-900">Pricing</Link></li>
                <li><Link href="/integrations" className="hover:text-gray-900">Integrations</Link></li>
                <li><Link href="/changelog" className="hover:text-gray-900">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-3 text-gray-600">
                <li><Link href="/about" className="hover:text-gray-900">About</Link></li>
                <li><Link href="/blog" className="hover:text-gray-900">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-gray-900">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-gray-900">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-3 text-gray-600">
                <li><Link href="/docs" className="hover:text-gray-900">Documentation</Link></li>
                <li><Link href="/guides" className="hover:text-gray-900">Guides</Link></li>
                <li><Link href="/webinars" className="hover:text-gray-900">Webinars</Link></li>
                <li><Link href="/support" className="hover:text-gray-900">Support</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-3 text-gray-600">
                <li><Link href="/privacy" className="hover:text-gray-900">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-gray-900">Terms</Link></li>
                <li><Link href="/security" className="hover:text-gray-900">Security</Link></li>
                <li><Link href="/gdpr" className="hover:text-gray-900">GDPR</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600">
              © 2025 InvestiScope PPM. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="https://twitter.com/investiscope" className="text-gray-400 hover:text-gray-600">
                <span className="sr-only">Twitter</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="https://linkedin.com/company/investiscope" className="text-gray-400 hover:text-gray-600">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
