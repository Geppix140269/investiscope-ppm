// Global document configurations for different countries and grant programs

export interface CountryConfig {
  code: string
  name: string
  currency: string
  documentPatterns: {
    invoice: RegExp[]
    contract: RegExp[]
    permit: RegExp[]
    receipt: RegExp[]
    certification: RegExp[]
  }
  grantPrograms: {
    id: string
    name: string
    description: string
    maxAmount?: number
    requirements: DocumentRequirement[]
  }[]
}

export interface DocumentRequirement {
  type: string
  name: string
  required: boolean
  min?: number
  description?: string
}

export const countryConfigs: Record<string, CountryConfig> = {
  IT: {
    code: 'IT',
    name: 'Italy',
    currency: 'EUR',
    documentPatterns: {
      invoice: [/fattura/i, /invoice/i],
      contract: [/contratto/i, /contract/i, /accordo/i],
      permit: [/permesso/i, /autorizzazione/i, /scia/i, /cila/i, /dia/i],
      receipt: [/ricevuta/i, /receipt/i, /scontrino/i],
      certification: [/certificat/i, /attestato/i, /ape/i]
    },
    grantPrograms: [
      {
        id: 'mini_pia',
        name: 'Mini PIA',
        description: 'Puglia regional grant for property renovation',
        maxAmount: 2250000,
        requirements: [
          { type: 'contract', name: 'Purchase Contract', required: true },
          { type: 'permit', name: 'Building Permits', required: true },
          { type: 'plan', name: 'Project Plans', required: true },
          { type: 'quote', name: 'Contractor Quotes', required: true, min: 3 },
          { type: 'invoice', name: 'Invoices with P.IVA', required: true }
        ]
      },
      {
        id: 'superbonus',
        name: 'Superbonus 110%',
        description: 'Energy efficiency renovation incentive',
        requirements: [
          { type: 'certification', name: 'APE (Pre-work)', required: true },
          { type: 'certification', name: 'APE (Post-work)', required: true },
          { type: 'report', name: 'Technical Report', required: true },
          { type: 'invoice', name: 'Invoices', required: true }
        ]
      }
    ]
  },
  US: {
    code: 'US',
    name: 'United States',
    currency: 'USD',
    documentPatterns: {
      invoice: [/invoice/i, /bill/i],
      contract: [/contract/i, /agreement/i],
      permit: [/permit/i, /license/i, /authorization/i],
      receipt: [/receipt/i],
      certification: [/certificat/i, /inspection/i]
    },
    grantPrograms: [
      {
        id: 'energy_tax_credit',
        name: 'Energy Tax Credit',
        description: 'Federal tax credit for energy efficiency improvements',
        requirements: [
          { type: 'certification', name: 'Energy Star Certification', required: true },
          { type: 'invoice', name: 'Contractor Invoices', required: true },
          { type: 'contract', name: 'Installation Contract', required: true }
        ]
      }
    ]
  },
  UK: {
    code: 'UK',
    name: 'United Kingdom',
    currency: 'GBP',
    documentPatterns: {
      invoice: [/invoice/i, /bill/i],
      contract: [/contract/i, /agreement/i],
      permit: [/planning[\s-]?permission/i, /building[\s-]?regulations/i],
      receipt: [/receipt/i],
      certification: [/certificat/i, /epc/i]
    },
    grantPrograms: [
      {
        id: 'green_homes_grant',
        name: 'Green Homes Grant',
        description: 'Energy efficiency improvements grant',
        requirements: [
          { type: 'certification', name: 'EPC Certificate', required: true },
          { type: 'quote', name: 'Installer Quotes', required: true },
          { type: 'invoice', name: 'VAT Invoices', required: true }
        ]
      }
    ]
  },
  FR: {
    code: 'FR',
    name: 'France',
    currency: 'EUR',
    documentPatterns: {
      invoice: [/facture/i, /invoice/i],
      contract: [/contrat/i, /contract/i],
      permit: [/permis/i, /autorisation/i],
      receipt: [/reçu/i, /receipt/i],
      certification: [/certificat/i, /dpe/i]
    },
    grantPrograms: [
      {
        id: 'ma_prime_renov',
        name: "MaPrimeRénov'",
        description: 'Energy renovation grant',
        requirements: [
          { type: 'certification', name: 'DPE (Energy Diagnostic)', required: true },
          { type: 'quote', name: 'RGE Certified Quotes', required: true },
          { type: 'invoice', name: 'Invoices', required: true }
        ]
      }
    ]
  },
  ES: {
    code: 'ES',
    name: 'Spain',
    currency: 'EUR',
    documentPatterns: {
      invoice: [/factura/i, /invoice/i],
      contract: [/contrato/i, /contract/i],
      permit: [/licencia/i, /permiso/i],
      receipt: [/recibo/i, /receipt/i],
      certification: [/certificado/i, /cee/i]
    },
    grantPrograms: [
      {
        id: 'plan_eco_vivienda',
        name: 'Plan Eco Vivienda',
        description: 'Sustainable housing renovation plan',
        requirements: [
          { type: 'certification', name: 'CEE Certificate', required: true },
          { type: 'project', name: 'Technical Project', required: true },
          { type: 'invoice', name: 'Invoices with NIF', required: true }
        ]
      }
    ]
  },
  PT: {
    code: 'PT',
    name: 'Portugal',
    currency: 'EUR',
    documentPatterns: {
      invoice: [/fatura/i, /invoice/i],
      contract: [/contrato/i, /contract/i],
      permit: [/licença/i, /alvará/i],
      receipt: [/recibo/i, /receipt/i],
      certification: [/certificado/i]
    },
    grantPrograms: [
      {
        id: 'programa_eficiencia',
        name: 'Programa de Eficiência Energética',
        description: 'Energy efficiency program',
        requirements: [
          { type: 'certification', name: 'Energy Certificate', required: true },
          { type: 'quote', name: 'Contractor Quotes', required: true },
          { type: 'invoice', name: 'Invoices with NIF', required: true }
        ]
      }
    ]
  }
}

// Helper function to get grant requirements
export function getGrantRequirements(countryCode: string, grantId: string): DocumentRequirement[] | null {
  const country = countryConfigs[countryCode]
  if (!country) return null
  
  const grant = country.grantPrograms.find(g => g.id === grantId)
  return grant?.requirements || null
}

// Helper function to get document patterns for a country
export function getDocumentPatterns(countryCode: string) {
  return countryConfigs[countryCode]?.documentPatterns || countryConfigs['US'].documentPatterns
}
