import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-emerald-600 bg-[length:400%_400%] animate-gradient">
        {/* Animated background elements */}
        <div className="absolute -top-1/2 -right-1/2 w-[200%] h-[200%] opacity-10" 
             style={{
               background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
               animation: 'shimmer 15s linear infinite'
             }} />
        
        {/* Glass overlay for depth */}
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-5 text-center">
          {/* Glass Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full text-sm font-semibold mb-8 animate-fadeIn shadow-xl">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            PROPERTY PROJECT MANAGEMENT FOR PUGLIA
          </div>
          
          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-white mb-8 animate-fadeIn animation-delay-100 leading-tight">
            Manage Your Italian<br />
            <span className="font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
              Property Projects
            </span>
          </h1>
          
          {/* Glass Card for Subtitle */}
          <div className="max-w-4xl mx-auto mb-10 animate-fadeIn animation-delay-200">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
              <p className="text-xl md:text-2xl text-white font-medium mb-3">
                Professional PPM Platform for International Investors
              </p>
              <p className="text-lg md:text-xl text-white/90 font-light">
                Track properties, manage renovations, collaborate with teams, and maximize your Puglia grants—all in one place
              </p>
            </div>
          </div>
          
          {/* Glass Benefits Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 animate-fadeIn animation-delay-300">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 rounded-2xl text-white font-medium text-sm hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
              ✓ Property Portfolio
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 rounded-2xl text-white font-medium text-sm hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
              ✓ Project Tracking
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 rounded-2xl text-white font-medium text-sm hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
              ✓ Team Collaboration
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 rounded-2xl text-white font-medium text-sm hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
              ✓ Grant Integration
            </div>
          </div>
          
          {/* Glass CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center animate-fadeIn animation-delay-400">
            <Link 
              href="/register"
              className="bg-white/90 backdrop-blur-md text-indigo-700 px-8 py-5 rounded-full font-bold hover:bg-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-lg border border-white/50"
            >
              Start Free Trial
            </Link>
            <Link 
              href="/login"
              className="group inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white px-8 py-5 rounded-full text-lg font-bold hover:bg-white/20 hover:border-white/50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Sign In
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          {/* Glass Stats Card */}
          <div className="mt-16 animate-fadeIn animation-delay-500">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 inline-block shadow-xl">
              <div className="flex flex-wrap justify-center items-center gap-8 text-white">
                <div>
                  <p className="text-3xl font-bold">€2.5M+</p>
                  <p className="text-sm opacity-80">Grants Tracked</p>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <div>
                  <p className="text-3xl font-bold">150+</p>
                  <p className="text-sm opacity-80">Active Projects</p>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <div>
                  <p className="text-3xl font-bold">98%</p>
                  <p className="text-sm opacity-80">Success Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator with glass effect */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-full">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section with Glass Cards */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-indigo-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-5 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block bg-gradient-to-r from-indigo-600 to-emerald-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
              POWERFUL FEATURES
            </div>
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
              Everything You Need to <strong className="font-bold">Succeed</strong>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Built specifically for international property investors in Puglia
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-white/50">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Property Portfolio</h3>
              <p className="text-gray-700">
                Track all your Puglia properties with detailed information, documents, and financial data in one place
              </p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-white/50">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Project Management</h3>
              <p className="text-gray-700">
                Manage renovations with timelines, budgets, tasks, and milestones. Track Mini PIA grant progress
              </p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-white/50">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Team Collaboration</h3>
              <p className="text-gray-700">
                Invite architects, contractors, and property managers. Assign tasks and track progress together
              </p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-white/50">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Document Management</h3>
              <p className="text-gray-700">
                Store contracts, permits, invoices, and photos. Access your documents anytime, anywhere
              </p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-white/50">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">Financial Tracking</h3>
              <p className="text-gray-700">
                Monitor budgets, expenses, and ROI. Track grant applications and disbursements
              </p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-white/50">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">Grant Calculator</h3>
              <p className="text-gray-700">
                Built-in Mini PIA grant calculator. Check eligibility and track application status
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-emerald-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.1)_0%,transparent_70%)]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-5 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-5 py-2 rounded-full text-sm font-semibold mb-6">
              🔗 SEAMLESS INTEGRATION
            </div>
            <h2 className="text-3xl md:text-5xl font-light text-white mb-4">
              Part of the <strong className="font-bold">InvestiScope Suite</strong>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              PPM integrates perfectly with our grant calculators and investment tools
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/15 hover:-translate-y-2 transition-all text-center">
              <div className="text-4xl mb-4 filter drop-shadow-lg">🧮</div>
              <h3 className="text-xl font-bold mb-3 text-emerald-400">Grant Calculator</h3>
              <p className="text-gray-300 mb-4">
                Calculate Mini PIA grants up to €2.25M directly within your project
              </p>
              <Link href="https://investiscope.net/calculator" className="text-emerald-400 hover:text-emerald-300 font-medium">
                Learn More →
              </Link>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/15 hover:-translate-y-2 transition-all text-center">
              <div className="text-4xl mb-4 filter drop-shadow-lg">🔍</div>
              <h3 className="text-xl font-bold mb-3 text-cyan-400">Property Survey</h3>
              <p className="text-gray-300 mb-4">
                Order professional property surveys and store reports in your project
              </p>
              <Link href="https://investiscope.net/surveys" className="text-cyan-400 hover:text-cyan-300 font-medium">
                Learn More →
              </Link>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/15 hover:-translate-y-2 transition-all text-center">
              <div className="text-4xl mb-4 filter drop-shadow-lg">📊</div>
              <h3 className="text-xl font-bold mb-3 text-orange-400">ROI Analysis</h3>
              <p className="text-gray-300 mb-4">
                Advanced ROI projections integrated with your actual project data
              </p>
              <Link href="https://investiscope.net/tools" className="text-orange-400 hover:text-orange-300 font-medium">
                Learn More →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-indigo-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto px-5 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-emerald-600 text-white px-5 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg">
              💎 SIMPLE PRICING
            </div>
            <h2 className="text-3xl md:text-5xl font-light text-gray-900 mb-4">
              Choose Your <strong className="font-bold bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">Plan</strong>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-8 hover:-translate-y-2 transition-all border border-white/50">
              <h3 className="text-2xl font-bold mb-2">Free Trial</h3>
              <p className="text-gray-600 mb-6">Perfect for getting started</p>
              <div className="text-5xl font-bold text-gray-900 mb-6">€0</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>1 Property</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>2 Active Projects</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Basic Features</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>14-Day Trial</span>
                </li>
              </ul>
              <Link href="/register" className="block w-full bg-gray-900 text-white text-center py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors">
                Start Free Trial
              </Link>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-100 to-emerald-100 rounded-3xl shadow-xl p-8 hover:-translate-y-2 transition-all relative border-2 border-indigo-500">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-emerald-600 text-white px-6 py-2 rounded-full text-sm font-bold">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-2">Professional</h3>
              <p className="text-gray-600 mb-6">For serious investors</p>
              <div className="text-5xl font-bold text-gray-900 mb-6">€49<span className="text-lg font-normal text-gray-600">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Unlimited Properties</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Unlimited Projects</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Team Collaboration</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Grant Integration</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Priority Support</span>
                </li>
              </ul>
              <Link href="/register" className="block w-full bg-gradient-to-r from-indigo-600 to-emerald-600 text-white text-center py-4 rounded-xl font-bold hover:shadow-xl transition-all">
                Start Professional
              </Link>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-8 hover:-translate-y-2 transition-all border border-white/50">
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <p className="text-gray-600 mb-6">For teams & agencies</p>
              <div className="text-5xl font-bold text-gray-900 mb-6">€199<span className="text-lg font-normal text-gray-600">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>White Label Option</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>API Access</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Custom Integrations</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Dedicated Support</span>
                </li>
              </ul>
              <Link href="/contact" className="block w-full bg-gray-900 text-white text-center py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-emerald-600 text-white relative overflow-hidden animate-gradient bg-[length:400%_400%]">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-5 text-center relative z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20 shadow-2xl">
            <h2 className="text-3xl md:text-5xl font-light mb-6">
              Ready to Transform Your <strong className="font-bold">Property Management?</strong>
            </h2>
            <p className="text-xl mb-10 text-white/90">
              Join international investors who trust InvestiScope PPM for their Puglia projects
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                href="/register"
                className="text-lg px-10 py-5 bg-white text-indigo-700 hover:bg-gray-100 rounded-full font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
              >
                Start 14-Day Free Trial
              </Link>
              <Link 
                href="/demo"
                className="text-lg px-10 py-5 bg-transparent border-2 border-white text-white hover:bg-white hover:text-indigo-700 rounded-full font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
              >
                Request Demo
              </Link>
            </div>
            
            <p className="mt-8 text-sm text-white/70">
              No credit card required • Free trial includes all features
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">InvestiScope PPM</h3>
              <p className="text-sm">Property project management designed for international investors in Puglia, Italy.</p>
              <p className="text-xs mt-4">Part of the InvestiScope Suite</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/integrations" className="hover:text-white transition-colors">Integrations</Link></li>
                <li><Link href="/api" className="hover:text-white transition-colors">API</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/guides" className="hover:text-white transition-colors">User Guides</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/support" className="hover:text-white transition-colors">Support</Link></li>
                <li><a href="https://investiscope.net" className="hover:text-white transition-colors">InvestiScope Main</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2025 InvestiScope PPM. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
