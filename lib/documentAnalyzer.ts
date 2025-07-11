import { createClient } from '@/lib/supabase/client'

export type DocumentCategory =
  | 'invoice'
  | 'contract'
  | 'permit'
  | 'quote'
  | 'receipt'
  | 'plan'
  | 'report'
  | 'certificate'
  | 'grant_application'
  | 'other'
  | 'photo'

interface DocumentMetadata {
  category?: string
  extractedData?: {
    amount?: number
    vendor?: string
    date?: string
    invoiceNumber?: string
    [key: string]: any
  }
  confidence?: number
  language?: string
  [key: string]: any
}

interface AnalysisResult {
  category: string
  confidence: number
  extractedData?: {
    amount?: number
    vendor?: string
    date?: string
    invoiceNumber?: string
    [key: string]: any
  }
  suggestedActions?: string[]
  complianceFlags?: string[]
}

export class DocumentAnalyzer {
  private supabase = createClient()

  async analyzeDocument(file: File, projectId?: string): Promise<AnalysisResult> {
    const fileName = file.name.toLowerCase()
    const fileType = file.type
    
    // Basic categorization based on filename and type
    const category = this.categorizeDocument(fileName, fileType)
    
    // For invoices, extract financial data
    if (category === 'invoice') {
      const extractedData = await this.extractInvoiceData(file)
      return {
        category,
        confidence: 0.9,
        extractedData,
        suggestedActions: ['Review amount', 'Approve for payment', 'Add to expenses'],
        complianceFlags: []
      }
    }
    
    // For permits, check compliance
    if (category === 'permit') {
      const complianceFlags = this.checkPermitCompliance(fileName)
      return {
        category,
        confidence: 0.85,
        complianceFlags,
        suggestedActions: ['Verify expiration date', 'Add to project timeline']
      }
    }
    
    // For contracts
    if (category === 'contract') {
      return {
        category,
        confidence: 0.8,
        suggestedActions: ['Review terms', 'Set reminder for renewal', 'Extract key dates'],
        complianceFlags: []
      }
    }
    
    // Default response
    return {
      category,
      confidence: 0.7,
      suggestedActions: ['Review document', 'Add tags'],
      complianceFlags: []
    }
  }

  private categorizeDocument(fileName: string, fileType: string): string {
    // Invoice detection
    if (fileName.includes('invoice') || fileName.includes('fattura') || 
        fileName.includes('receipt') || fileName.includes('ricevuta') ||
        fileName.includes('bill') || fileName.includes('bolletta')) {
      return 'invoice'
    }
    
    // Contract detection
    if (fileName.includes('contract') || fileName.includes('contratto') || 
        fileName.includes('agreement') || fileName.includes('accordo') ||
        fileName.includes('lease') || fileName.includes('locazione')) {
      return 'contract'
    }
    
    // Permit detection
    if (fileName.includes('permit') || fileName.includes('permesso') || 
        fileName.includes('license') || fileName.includes('licenza') ||
        fileName.includes('scia') || fileName.includes('cila') ||
        fileName.includes('dia') || fileName.includes('autorizzazione')) {
      return 'permit'
    }
    
    // Plan detection
    if (fileName.includes('plan') || fileName.includes('planimetria') || 
        fileName.includes('blueprint') || fileName.includes('progetto') ||
        fileName.includes('drawing') || fileName.includes('disegno')) {
      return 'plan'
    }
    
    // Report detection
    if (fileName.includes('report') || fileName.includes('relazione') || 
        fileName.includes('survey') || fileName.includes('perizia') ||
        fileName.includes('inspection') || fileName.includes('ispezione')) {
      return 'report'
    }
    
    // Photo detection
    if (fileType.includes('image')) {
      return 'photo'
    }
    
    // Technical documents
    if (fileName.includes('ape') || fileName.includes('certificat') ||
        fileName.includes('energetic') || fileName.includes('energy')) {
      return 'certificate'
    }
    
    return 'other'
  }

  private async extractInvoiceData(file: File): Promise<any> {
    // In production, this would use OCR and AI services
    // For now, we'll return mock data based on file size to simulate extraction
    
    const mockData = {
      amount: Math.floor(Math.random() * 10000) + 100,
      vendor: `Vendor ${Math.floor(Math.random() * 100)}`,
      date: new Date().toISOString().split('T')[0],
      invoiceNumber: `INV-${Date.now()}`,
      currency: 'EUR',
      items: [
        {
          description: 'Construction materials',
          quantity: 1,
          unitPrice: Math.floor(Math.random() * 1000) + 50,
          total: Math.floor(Math.random() * 1000) + 50
        }
      ],
      tax: {
        rate: 22,
        amount: Math.floor(Math.random() * 200) + 20
      }
    }
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return mockData
  }

  private checkPermitCompliance(fileName: string): string[] {
    const flags: string[] = []
    
    // Check for Italian permit types
    if (fileName.includes('scia')) {
      flags.push('SCIA - Verify 30-day silent approval period')
    }
    
    if (fileName.includes('cila')) {
      flags.push('CILA - Ensure work description matches project scope')
    }
    
    if (fileName.includes('dia')) {
      flags.push('DIA - Check validity period (typically 3 years)')
    }
    
    if (fileName.includes('permesso') && fileName.includes('costruire')) {
      flags.push('Building Permit - Verify all conditions are met')
    }
    
    // Check for expiration indicators
    if (fileName.includes('scadut') || fileName.includes('expired')) {
      flags.push('⚠️ Document may be expired - verify dates')
    }
    
    return flags
  }

  async getDocumentStats(propertyId: string): Promise<{
    total: number
    byCategory: Record<string, number>
    recentUploads: number
    totalSize: number
    complianceScore: number
    totalInvoiceAmount: number
  }> {
    const { data: documents } = await this.supabase
      .from('documents')
      .select('*')
      .eq('property_id', propertyId)
    
    if (!documents) {
      return {
        total: 0,
        byCategory: {},
        recentUploads: 0,
        totalSize: 0,
        complianceScore: 100,
        totalInvoiceAmount: 0
      }
    }
    
    const stats: {
      total: number
      byCategory: Record<string, number>
      recentUploads: number
      totalSize: number
      complianceScore: number
      totalInvoiceAmount: number
    } = {
      total: documents.length,
      byCategory: {},
      recentUploads: 0,
      totalSize: 0,
      complianceScore: 100,
      totalInvoiceAmount: 0
    }
    
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    documents.forEach(doc => {
      if (doc.metadata?.category) {
        const category = doc.metadata.category as string
        stats.byCategory[category] = (stats.byCategory[category] || 0) + 1
        
        if (doc.metadata.category === 'invoice' && doc.metadata.extractedData?.amount) {
          stats.totalInvoiceAmount += doc.metadata.extractedData.amount
        }
      }
      
      if (new Date(doc.created_at) > oneWeekAgo) {
        stats.recentUploads++
      }
      
      stats.totalSize += doc.file_size || 0
    })
    
    // Calculate compliance score based on document completeness
    const requiredDocs = ['permit', 'contract', 'invoice']
    const missingDocs = requiredDocs.filter(
      docType => !stats.byCategory[docType]
    )
    stats.complianceScore = Math.max(0, 100 - (missingDocs.length * 20))
    
    return stats
  }

  async suggestMissingDocuments(propertyId: string, projectType?: string): Promise<string[]> {
    const { data: documents } = await this.supabase
      .from('documents')
      .select('metadata')
      .eq('property_id', propertyId)
    
    const existingCategories = new Set(
      documents?.map(doc => doc.metadata?.category).filter(Boolean) || []
    )
    
    const suggestions: string[] = []
    
    // Base required documents for any property
    const baseRequired = [
      { category: 'contract', name: 'Purchase Contract' },
      { category: 'plan', name: 'Floor Plans' },
      { category: 'permit', name: 'Building Permits' },
      { category: 'certificate', name: 'Energy Certificate (APE)' }
    ]
    
    // Project-specific documents
    const projectSpecific: Record<string, Array<{ category: string; name: string }>> = {
      renovation: [
        { category: 'permit', name: 'SCIA/CILA for renovation' },
        { category: 'contract', name: 'Contractor Agreement' },
        { category: 'plan', name: 'Renovation Plans' }
      ],
      restoration: [
        { category: 'permit', name: 'Heritage Authority Approval' },
        { category: 'report', name: 'Structural Survey' },
        { category: 'plan', name: 'Restoration Project' }
      ],
      rental: [
        { category: 'contract', name: 'Rental Agreement' },
        { category: 'certificate', name: 'Habitability Certificate' },
        { category: 'report', name: 'Property Inventory' }
      ]
    }
    
    // Check base required documents
    baseRequired.forEach(doc => {
      if (!existingCategories.has(doc.category)) {
        suggestions.push(doc.name)
      }
    })
    
    // Check project-specific documents if project type is provided
    if (projectType && projectSpecific[projectType]) {
      projectSpecific[projectType].forEach(doc => {
        if (!existingCategories.has(doc.category)) {
          suggestions.push(doc.name)
        }
      })
    }
    
    return suggestions
  }
}
