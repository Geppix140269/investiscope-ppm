// Document Analysis Utilities for InvestiScope PPM
// This module provides document intelligence capabilities

import { createClient } from '@/lib/supabase/client'

// Document type definitions
export type DocumentCategory = 
  | 'invoice' 
  | 'contract' 
  | 'permit' 
  | 'quote' 
  | 'receipt' 
  | 'plan' 
  | 'report' 
  | 'certification'
  | 'grant_application'
  | 'other'

export interface DocumentAnalysis {
  category: DocumentCategory
  confidence: number
  extractedData: {
    // Common fields
    documentDate?: string
    documentNumber?: string
    totalAmount?: number
    currency?: string
    
    // Invoice/Receipt specific
    vendor?: string
    vatNumber?: string
    subtotal?: number
    vatAmount?: number
    
    // Contract specific
    parties?: string[]
    contractType?: string
    startDate?: string
    endDate?: string
    
    // Permit specific
    permitType?: string
    issuingAuthority?: string
    expiryDate?: string
    
    // Grant specific
    grantProgram?: string
    applicationNumber?: string
    requestedAmount?: number
    
    // Extracted text content
    fullText?: string
    summary?: string
  }
  metadata: {
    language?: string
    pageCount?: number
    hasSignatures?: boolean
    quality?: 'high' | 'medium' | 'low'
  }
}

export class DocumentAnalyzer {
  private supabase = createClient()

  // Analyze document based on filename patterns and metadata
  async analyzeDocument(file: File): Promise<DocumentAnalysis> {
    const analysis: DocumentAnalysis = {
      category: 'other',
      confidence: 0,
      extractedData: {},
      metadata: {}
    }

    // Step 1: Analyze filename for clues
    const filenameAnalysis = this.analyzeFilename(file.name)
    analysis.category = filenameAnalysis.category
    analysis.confidence = filenameAnalysis.confidence

    // Step 2: Analyze file type and size
    if (file.type.includes('pdf')) {
      analysis.metadata.quality = file.size > 1024 * 1024 ? 'high' : 'medium'
    } else if (file.type.includes('image')) {
      analysis.metadata.quality = file.size > 500 * 1024 ? 'medium' : 'low'
    }

    // Step 3: For images, we could integrate with OCR services
    if (file.type.includes('image')) {
      // TODO: Integrate with OCR service (Google Vision, AWS Textract, etc.)
      // const ocrResult = await this.performOCR(file)
      // analysis.extractedData.fullText = ocrResult.text
    }

    // Step 4: Pattern matching for Italian documents
    if (analysis.category === 'invoice' || analysis.category === 'receipt') {
      analysis.extractedData = {
        ...analysis.extractedData,
        ...this.extractInvoicePatterns(file.name)
      }
    }

    return analysis
  }

  // Analyze filename for document type hints
  private analyzeFilename(filename: string): { category: DocumentCategory, confidence: number } {
    const lowerName = filename.toLowerCase()
    
    // Italian document patterns
    const patterns: Array<{ pattern: RegExp | string, category: DocumentCategory, confidence: number }> = [
      // Invoices
      { pattern: /fattura/i, category: 'invoice', confidence: 0.9 },
      { pattern: /invoice/i, category: 'invoice', confidence: 0.9 },
      { pattern: /inv[-_\s]?\d+/i, category: 'invoice', confidence: 0.8 },
      
      // Contracts
      { pattern: /contratto/i, category: 'contract', confidence: 0.9 },
      { pattern: /contract/i, category: 'contract', confidence: 0.9 },
      { pattern: /accordo/i, category: 'contract', confidence: 0.7 },
      
      // Permits
      { pattern: /permesso/i, category: 'permit', confidence: 0.9 },
      { pattern: /permit/i, category: 'permit', confidence: 0.9 },
      { pattern: /autorizzazione/i, category: 'permit', confidence: 0.9 },
      { pattern: /scia/i, category: 'permit', confidence: 0.95 }, // Italian building permit
      { pattern: /cila/i, category: 'permit', confidence: 0.95 }, // Italian building permit
      { pattern: /dia/i, category: 'permit', confidence: 0.9 },
      
      // Quotes
      { pattern: /preventivo/i, category: 'quote', confidence: 0.9 },
      { pattern: /quote/i, category: 'quote', confidence: 0.9 },
      { pattern: /quotation/i, category: 'quote', confidence: 0.9 },
      
      // Receipts
      { pattern: /ricevuta/i, category: 'receipt', confidence: 0.9 },
      { pattern: /receipt/i, category: 'receipt', confidence: 0.9 },
      { pattern: /scontrino/i, category: 'receipt', confidence: 0.9 },
      
      // Plans
      { pattern: /planimetria/i, category: 'plan', confidence: 0.9 },
      { pattern: /blueprint/i, category: 'plan', confidence: 0.9 },
      { pattern: /floor[\s-_]?plan/i, category: 'plan', confidence: 0.9 },
      { pattern: /progetto/i, category: 'plan', confidence: 0.7 },
      
      // Reports
      { pattern: /relazione/i, category: 'report', confidence: 0.8 },
      { pattern: /report/i, category: 'report', confidence: 0.8 },
      { pattern: /perizia/i, category: 'report', confidence: 0.9 },
      
      // Certifications
      { pattern: /certificat/i, category: 'certification', confidence: 0.9 },
      { pattern: /attestato/i, category: 'certification', confidence: 0.9 },
      { pattern: /ape/i, category: 'certification', confidence: 0.95 }, // Energy certificate
      
      // Grants
      { pattern: /mini[\s-_]?pia/i, category: 'grant_application', confidence: 0.95 },
      { pattern: /bando/i, category: 'grant_application', confidence: 0.8 },
      { pattern: /grant/i, category: 'grant_application', confidence: 0.8 },
    ]

    for (const { pattern, category, confidence } of patterns) {
      if (typeof pattern === 'string' ? lowerName.includes(pattern) : pattern.test(lowerName)) {
        return { category, confidence }
      }
    }

    return { category: 'other', confidence: 0.5 }
  }

  // Extract common invoice patterns from filename
  private extractInvoicePatterns(filename: string): Partial<DocumentAnalysis['extractedData']> {
    const extracted: Partial<DocumentAnalysis['extractedData']> = {}

    // Extract invoice number
    const invoiceNumberMatch = filename.match(/(?:fattura|inv|invoice)[-_\s]?(\d+)/i)
    if (invoiceNumberMatch) {
      extracted.documentNumber = invoiceNumberMatch[1]
    }

    // Extract date patterns (Italian format DD-MM-YYYY or DD/MM/YYYY)
    const dateMatch = filename.match(/(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/i)
    if (dateMatch) {
      extracted.documentDate = dateMatch[1]
    }

    // Extract amount (looking for euro amounts)
    const amountMatch = filename.match(/€?\s*(\d+[.,]?\d*)/i)
    if (amountMatch) {
      extracted.totalAmount = parseFloat(amountMatch[1].replace(',', '.'))
      extracted.currency = 'EUR'
    }

    return extracted
  }

  // Save analysis results to database
  async saveAnalysis(documentId: string, analysis: DocumentAnalysis): Promise<void> {
    const { error } = await this.supabase
      .from('documents')
      .update({
        metadata: {
          ...analysis,
          analyzedAt: new Date().toISOString()
        }
      })
      .eq('id', documentId)

    if (error) {
      console.error('Error saving document analysis:', error)
    }
  }

  // Get document statistics for a project
  async getProjectDocumentStats(projectId: string) {
    const { data: documents } = await this.supabase
      .from('documents')
      .select('metadata')
      .eq('project_id', projectId)

    if (!documents) return null

    const stats = {
      total: documents.length,
      byCategory: {} as Record<DocumentCategory, number>,
      totalInvoiceAmount: 0,
      missingDocuments: [] as string[]
    }

    documents.forEach(doc => {
      if (doc.metadata?.category) {
        stats.byCategory[doc.metadata.category] = (stats.byCategory[doc.metadata.category] || 0) + 1
        
        if (doc.metadata.category === 'invoice' && doc.metadata.extractedData?.totalAmount) {
          stats.totalInvoiceAmount += doc.metadata.extractedData.totalAmount
        }
      }
    })

    // Check for missing critical documents
    const requiredDocs = ['contract', 'permit']
    requiredDocs.forEach(docType => {
      if (!stats.byCategory[docType as DocumentCategory]) {
        stats.missingDocuments.push(docType)
      }
    })

    return stats
  }

  // Validate document quality for grant applications
  validateForGrants(analysis: DocumentAnalysis): { isValid: boolean, issues: string[] } {
    const issues: string[] = []

    // Check document quality
    if (analysis.metadata.quality === 'low') {
      issues.push('Document quality is too low. Please upload a higher resolution version.')
    }

    // Check for required fields based on document type
    if (analysis.category === 'invoice') {
      if (!analysis.extractedData.vendor) issues.push('Vendor name not detected')
      if (!analysis.extractedData.vatNumber) issues.push('VAT number not found')
      if (!analysis.extractedData.totalAmount) issues.push('Total amount not detected')
    }

    if (analysis.category === 'contract') {
      if (!analysis.extractedData.parties || analysis.extractedData.parties.length < 2) {
        issues.push('Contract parties not clearly identified')
      }
    }

    if (analysis.category === 'permit') {
      if (!analysis.extractedData.expiryDate) issues.push('Permit expiry date not found')
      if (!analysis.extractedData.issuingAuthority) issues.push('Issuing authority not identified')
    }

    return {
      isValid: issues.length === 0,
      issues
    }
  }
}
