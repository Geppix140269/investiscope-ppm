// File: app/page.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { ChevronRight, CheckCircle, Globe, Shield, Users, FileText, Calculator, Search, Star, ArrowRight, Menu, X, Phone, Mail, MapPin, Building2, Briefcase, Home, TrendingUp, Clock, Award, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { value: '€127M', label: 'Property Value Managed' },
    { value: '1,247', label: 'Successful Purchases' },
    { value: '18', label: 'Years of Experience' },
    { value: '98%', label: 'Client Satisfaction' }
  ];

  const services = [
    {
      icon: <Search className="w-6 h-6" />,
      title: 'Property Search',
      description: 'Access exclusive listings and off-market opportunities across Italy'
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Legal Compliance',
      description: 'Navigate Italian bureaucracy with confidence and full legal support'
    },
    {
      icon: <Calculator className="w-6 h-6" />,
      title: 'Financial Planning',
      description: 'Comprehensive cost analysis including taxes, fees, and hidden expenses'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Vetted Professionals',
      description: 'Connect with English-speaking notaries, architects, and contractors'
    }
  ];

  const processSteps = [
    {
      number: '01',
      title: 'Discovery',
      description: 'Define your requirements and explore curated properties matching your criteria'
    },
    {
      number: '02',
      title: 'Due Diligence',
      description: 'Comprehensive property analysis, legal verification, and risk assessment'
    },
    {
      number: '03',
      title: 'Acquisition',
      description: 'Seamless purchase process with full legal and financial guidance'
    },
    {
      number: '04',
      title: 'Management',
      description: 'Ongoing property management, renovation support, and value optimization'
    }
  ];

  const testimonials = [
    {
      name: 'James & Sarah Mitchell',
      location: 'London, UK',
      property: 'Trullo in Ostuni',
      text: 'InvestiScope transformed what could have been a nightmare into a smooth, professional experience. Their local knowledge and attention to detail saved us from several costly mistakes.',
      image: '👥'
    },
    {
      name: 'Dr. Michael Chen',
      location: 'New York, USA',
      property: 'Villa in Tuscany',
      text: 'The platform\'s document management and professional network were invaluable. I could manage the entire purchase remotely with complete confidence.',
      image: '👨‍⚕️'
    },
    {
      name: 'The Anderson Family',
      location: 'Sydney, Australia',
      property: 'Masseria in Puglia',
      text: 'From finding the property to managing the renovation, InvestiScope guided us through every step. Their cost calculator was spot-on - no surprises.',
      image: '👨‍👩‍👧‍👦'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero - Sophisticated, minimal */}
      <section className="relative min-h-screen flex items-center pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl lg:text-6xl font-light leading-tight mb-6">
                Invest in Italian
                <span className="block font-normal">Real Estate</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Navigate the Italian property market with confidence. 
                From search to purchase to management, we provide the expertise and tools 
                international investors need to succeed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register" className="inline-flex items-center justify-center bg-gray-900 text-white px-8 py-4 hover:bg-gray-800 transition-colors group">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#services" className="inline-flex items-center justify-center border border-gray-300 px-8 py-4 hover:border-gray-400 transition-colors">
                  Learn More
                </a>
              </div>
              <div className="mt-12 flex items-center gap-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <span>Licensed & Insured</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  <span>Industry Leader</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-lg shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=800&h=600&fit=crop" 
                  alt="Italian villa with countryside view"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 shadow-lg rounded-lg">
                <div className="text-3xl font-light mb-1">€2.4M+</div>
                <div className="text-sm text-gray-600">Average Property Value</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats - Clean, impressive */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl font-light mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services - Professional layout */}
      <section id="services" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-light mb-4">Comprehensive Services</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every aspect of your Italian property investment, managed with precision and expertise
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, idx) => (
              <div key={idx} className="group">
                <div className="mb-4 text-gray-400 group-hover:text-gray-900 transition-colors">
                  {service.icon}
                </div>
                <h4 className="text-xl font-medium mb-3">{service.title}</h4>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process - Timeline style */}
      <section id="process" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-light mb-4">Your Investment Journey</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A structured approach to Italian property investment, from initial search to long-term management
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, idx) => (
              <div key={idx} className="relative">
                {idx < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-[1px] bg-gray-300"></div>
                )}
                <div className="text-5xl font-light text-gray-300 mb-4">{step.number}</div>
                <h4 className="text-xl font-medium mb-3">{step.title}</h4>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Rotating, sophisticated */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-light mb-4">Client Success Stories</h3>
          </div>
          <div className="relative">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className={`transition-all duration-500 ${
                  idx === activeTestimonial ? 'opacity-100' : 'opacity-0 absolute inset-0'
                }`}
              >
                <div className="bg-gray-50 p-12 rounded-lg">
                  <p className="text-xl leading-relaxed mb-8 italic">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{testimonial.name}</div>
                      <div className="text-gray-600">{testimonial.location} → {testimonial.property}</div>
                    </div>
                    <div className="text-4xl">{testimonial.image}</div>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-center mt-6 gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx === activeTestimonial ? 'bg-gray-900' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Special PPM Section */}
      <section className="py-24 bg-gradient-to-br from-indigo-50 to-emerald-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center bg-white px-4 py-2 rounded-full shadow-sm mb-6">
            <span className="text-sm font-medium text-gray-700">New</span>
            <span className="ml-2 text-sm text-indigo-600">Property Project Management Platform</span>
          </div>
          <h3 className="text-4xl font-light mb-6">Introducing InvestiScope PPM</h3>
          <p className="text-xl text-gray-600 mb-8">
            Manage your Italian property renovations and projects with our comprehensive 
            project management platform designed specifically for international investors.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-indigo-600 mb-3">📊</div>
              <h4 className="font-medium mb-2">Project Tracking</h4>
              <p className="text-sm text-gray-600">Monitor timelines, budgets, and milestones</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-emerald-600 mb-3">💶</div>
              <h4 className="font-medium mb-2">Grant Management</h4>
              <p className="text-sm text-gray-600">Track Mini PIA and other Italian grants</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-purple-600 mb-3">👥</div>
              <h4 className="font-medium mb-2">Team Collaboration</h4>
              <p className="text-sm text-gray-600">Coordinate with contractors and professionals</p>
            </div>
          </div>
          <Link 
            href="/register" 
            className="inline-flex items-center bg-indigo-600 text-white px-8 py-4 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Access PPM Platform
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* CTA - Professional, clear */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-4xl font-light mb-6">Begin Your Italian Investment Journey</h3>
          <p className="text-xl mb-8 text-gray-300">
            Join hundreds of international investors who have successfully navigated the Italian property market with our guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="inline-flex items-center justify-center bg-white text-gray-900 px-8 py-4 hover:bg-gray-100 transition-colors">
              Schedule Consultation
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center border border-gray-700 px-8 py-4 hover:border-gray-500 transition-colors">
              Contact Our Experts
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Minimal, professional */}
      <footer className="py-16 border-t">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-medium mb-4">InvestiScope Italy</h4>
              <p className="text-gray-600">Professional property investment services for the discerning international buyer.</p>
            </div>
            <div>
              <h5 className="font-medium mb-4">Services</h5>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Property Search</a></li>
                <li><a href="#" className="hover:text-gray-900">Legal Services</a></li>
                <li><a href="#" className="hover:text-gray-900">Financial Planning</a></li>
                <li><a href="#" className="hover:text-gray-900">Property Management</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-4">Company</h5>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900">About</a></li>
                <li><a href="#" className="hover:text-gray-900">Team</a></li>
                <li><a href="#" className="hover:text-gray-900">Careers</a></li>
                <li><a href="#" className="hover:text-gray-900">Contact</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-4">Contact</h5>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+39 080 123 4567</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>info@investiscope.net</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Milan • Rome • Bari</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-gray-600">
            <p>&copy; 2025 InvestiScope Italy. All rights reserved. • Privacy • Terms • Compliance</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
