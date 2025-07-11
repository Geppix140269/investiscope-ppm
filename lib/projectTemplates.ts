// lib/projectTemplates.ts

export interface ProjectTemplate {
  id: string
  name: string
  description: string
  icon: string
  category: string
  estimatedDuration: number // in days
  budgetRange: {
    min: number
    max: number
  }
  tasks: {
    title: string
    description: string
    priority: 'low' | 'medium' | 'high' | 'urgent'
    estimatedDays: number
    category: string
  }[]
  suggestedDocuments: string[]
}

export const projectTemplates: ProjectTemplate[] = [
  {
    id: 'kitchen-renovation',
    name: 'Kitchen Renovation',
    description: 'Complete kitchen remodel including cabinets, appliances, and finishes',
    icon: '🍳',
    category: 'renovation',
    estimatedDuration: 60,
    budgetRange: {
      min: 15000,
      max: 50000
    },
    tasks: [
      {
        title: 'Design and Planning',
        description: 'Create kitchen design layout and select materials',
        priority: 'high',
        estimatedDays: 7,
        category: 'planning'
      },
      {
        title: 'Obtain Permits',
        description: 'Submit plans and obtain necessary building permits',
        priority: 'urgent',
        estimatedDays: 14,
        category: 'permits'
      },
      {
        title: 'Demo Existing Kitchen',
        description: 'Remove old cabinets, appliances, and fixtures',
        priority: 'high',
        estimatedDays: 3,
        category: 'demolition'
      },
      {
        title: 'Electrical Work',
        description: 'Update electrical wiring and add new outlets',
        priority: 'high',
        estimatedDays: 4,
        category: 'electrical'
      },
      {
        title: 'Plumbing Updates',
        description: 'Relocate plumbing if needed, install new fixtures',
        priority: 'high',
        estimatedDays: 3,
        category: 'plumbing'
      },
      {
        title: 'Install Cabinets',
        description: 'Install new kitchen cabinets and island',
        priority: 'medium',
        estimatedDays: 3,
        category: 'carpentry'
      },
      {
        title: 'Countertop Installation',
        description: 'Template, fabricate, and install countertops',
        priority: 'medium',
        estimatedDays: 7,
        category: 'surfaces'
      },
      {
        title: 'Install Appliances',
        description: 'Install and connect all new appliances',
        priority: 'medium',
        estimatedDays: 2,
        category: 'appliances'
      },
      {
        title: 'Backsplash and Finishing',
        description: 'Install backsplash tile and finishing touches',
        priority: 'low',
        estimatedDays: 3,
        category: 'finishing'
      },
      {
        title: 'Final Inspection',
        description: 'Complete final inspection and touch-ups',
        priority: 'low',
        estimatedDays: 1,
        category: 'inspection'
      }
    ],
    suggestedDocuments: [
      'Kitchen design plans',
      'Building permits',
      'Appliance specifications',
      'Material invoices',
      'Contractor agreements',
      'Warranty documents'
    ]
  },
  {
    id: 'bathroom-remodel',
    name: 'Bathroom Remodel',
    description: 'Complete bathroom renovation including fixtures, tiles, and plumbing',
    icon: '🚿',
    category: 'renovation',
    estimatedDuration: 30,
    budgetRange: {
      min: 8000,
      max: 25000
    },
    tasks: [
      {
        title: 'Design Layout',
        description: 'Plan bathroom layout and select fixtures',
        priority: 'high',
        estimatedDays: 5,
        category: 'planning'
      },
      {
        title: 'Obtain Permits',
        description: 'Get necessary permits for plumbing and electrical',
        priority: 'urgent',
        estimatedDays: 10,
        category: 'permits'
      },
      {
        title: 'Demolition',
        description: 'Remove old fixtures, tiles, and vanity',
        priority: 'high',
        estimatedDays: 2,
        category: 'demolition'
      },
      {
        title: 'Plumbing Rough-in',
        description: 'Update plumbing for new fixture locations',
        priority: 'high',
        estimatedDays: 2,
        category: 'plumbing'
      },
      {
        title: 'Electrical Updates',
        description: 'Install GFCI outlets and update lighting',
        priority: 'high',
        estimatedDays: 2,
        category: 'electrical'
      },
      {
        title: 'Waterproofing',
        description: 'Apply waterproof membrane to wet areas',
        priority: 'high',
        estimatedDays: 1,
        category: 'waterproofing'
      },
      {
        title: 'Tile Installation',
        description: 'Install floor and wall tiles',
        priority: 'medium',
        estimatedDays: 4,
        category: 'tiling'
      },
      {
        title: 'Install Fixtures',
        description: 'Install toilet, shower, sink, and vanity',
        priority: 'medium',
        estimatedDays: 2,
        category: 'fixtures'
      },
      {
        title: 'Finishing Touches',
        description: 'Install accessories, mirrors, and final details',
        priority: 'low',
        estimatedDays: 1,
        category: 'finishing'
      }
    ],
    suggestedDocuments: [
      'Bathroom floor plan',
      'Plumbing permits',
      'Tile samples and invoices',
      'Fixture specifications',
      'Warranty information'
    ]
  },
  {
    id: 'trullo-restoration',
    name: 'Trullo Restoration',
    description: 'Traditional Puglia trullo restoration preserving historical features',
    icon: '🏛️',
    category: 'restoration',
    estimatedDuration: 120,
    budgetRange: {
      min: 30000,
      max: 100000
    },
    tasks: [
      {
        title: 'Historical Survey',
        description: 'Document existing structure and historical features',
        priority: 'urgent',
        estimatedDays: 7,
        category: 'survey'
      },
      {
        title: 'Structural Assessment',
        description: 'Engineer assessment of cone stability and foundation',
        priority: 'urgent',
        estimatedDays: 3,
        category: 'engineering'
      },
      {
        title: 'Heritage Permits',
        description: 'Obtain permits from Soprintendenza',
        priority: 'urgent',
        estimatedDays: 30,
        category: 'permits'
      },
      {
        title: 'Stone Repair',
        description: 'Repair and repoint traditional stone walls',
        priority: 'high',
        estimatedDays: 20,
        category: 'masonry'
      },
      {
        title: 'Cone Restoration',
        description: 'Restore traditional cone roof with chiancarelle',
        priority: 'high',
        estimatedDays: 15,
        category: 'roofing'
      },
      {
        title: 'Install Utilities',
        description: 'Carefully install modern utilities preserving structure',
        priority: 'medium',
        estimatedDays: 10,
        category: 'utilities'
      },
      {
        title: 'Traditional Flooring',
        description: 'Install or restore traditional chianche flooring',
        priority: 'medium',
        estimatedDays: 7,
        category: 'flooring'
      },
      {
        title: 'Lime Plaster Finish',
        description: 'Apply traditional lime plaster interior finish',
        priority: 'low',
        estimatedDays: 5,
        category: 'finishing'
      }
    ],
    suggestedDocuments: [
      'Historical survey report',
      'Structural engineering report',
      'Soprintendenza permits',
      'Traditional material certifications',
      'Before and after photos',
      'Artisan contracts'
    ]
  },
  {
    id: 'roof-replacement',
    name: 'Roof Replacement',
    description: 'Complete roof replacement with insulation upgrade',
    icon: '🏠',
    category: 'maintenance',
    estimatedDuration: 14,
    budgetRange: {
      min: 8000,
      max: 20000
    },
    tasks: [
      {
        title: 'Roof Inspection',
        description: 'Detailed inspection and measurements',
        priority: 'urgent',
        estimatedDays: 1,
        category: 'inspection'
      },
      {
        title: 'Material Selection',
        description: 'Choose roofing materials and insulation',
        priority: 'high',
        estimatedDays: 2,
        category: 'planning'
      },
      {
        title: 'Remove Old Roof',
        description: 'Strip old roofing materials',
        priority: 'high',
        estimatedDays: 2,
        category: 'demolition'
      },
      {
        title: 'Structural Repairs',
        description: 'Repair any damaged rafters or decking',
        priority: 'high',
        estimatedDays: 2,
        category: 'structural'
      },
      {
        title: 'Install Insulation',
        description: 'Add or upgrade roof insulation',
        priority: 'medium',
        estimatedDays: 1,
        category: 'insulation'
      },
      {
        title: 'Install New Roofing',
        description: 'Install new tiles or roofing material',
        priority: 'medium',
        estimatedDays: 3,
        category: 'roofing'
      },
      {
        title: 'Gutters and Finishing',
        description: 'Install gutters and complete finishing work',
        priority: 'low',
        estimatedDays: 2,
        category: 'finishing'
      }
    ],
    suggestedDocuments: [
      'Roof inspection report',
      'Material specifications',
      'Warranty documents',
      'Before and after photos',
      'Contractor insurance'
    ]
  },
  {
    id: 'energy-efficiency',
    name: 'Energy Efficiency Upgrade',
    description: 'Comprehensive energy efficiency improvements for Superbonus 110%',
    icon: '⚡',
    category: 'energy',
    estimatedDuration: 90,
    budgetRange: {
      min: 50000,
      max: 150000
    },
    tasks: [
      {
        title: 'Energy Audit (APE)',
        description: 'Pre-work energy performance certificate',
        priority: 'urgent',
        estimatedDays: 3,
        category: 'assessment'
      },
      {
        title: 'Technical Project',
        description: 'Prepare technical project for Superbonus',
        priority: 'urgent',
        estimatedDays: 10,
        category: 'planning'
      },
      {
        title: 'Submit ENEA Declaration',
        description: 'Submit required documentation to ENEA',
        priority: 'urgent',
        estimatedDays: 5,
        category: 'permits'
      },
      {
        title: 'External Insulation',
        description: 'Install cappotto termico (thermal coat)',
        priority: 'high',
        estimatedDays: 20,
        category: 'insulation'
      },
      {
        title: 'Window Replacement',
        description: 'Replace windows with high-efficiency models',
        priority: 'high',
        estimatedDays: 10,
        category: 'windows'
      },
      {
        title: 'Heat Pump Installation',
        description: 'Install heat pump system',
        priority: 'medium',
        estimatedDays: 5,
        category: 'hvac'
      },
      {
        title: 'Solar Panels',
        description: 'Install photovoltaic system',
        priority: 'medium',
        estimatedDays: 5,
        category: 'solar'
      },
      {
        title: 'Final APE',
        description: 'Post-work energy performance certificate',
        priority: 'low',
        estimatedDays: 3,
        category: 'certification'
      }
    ],
    suggestedDocuments: [
      'Pre-work APE certificate',
      'Technical project documents',
      'ENEA submission confirmation',
      'Material certifications',
      'Invoices with causale',
      'Post-work APE certificate',
      'Asseverazioni tecniche'
    ]
  },
  {
    id: 'pool-installation',
    name: 'Swimming Pool Installation',
    description: 'Design and install swimming pool with surrounding area',
    icon: '🏊',
    category: 'improvement',
    estimatedDuration: 60,
    budgetRange: {
      min: 25000,
      max: 80000
    },
    tasks: [
      {
        title: 'Site Survey',
        description: 'Survey and soil analysis',
        priority: 'urgent',
        estimatedDays: 2,
        category: 'survey'
      },
      {
        title: 'Pool Design',
        description: 'Create pool design and technical drawings',
        priority: 'high',
        estimatedDays: 7,
        category: 'planning'
      },
      {
        title: 'Building Permits',
        description: 'Obtain necessary permits for pool construction',
        priority: 'urgent',
        estimatedDays: 20,
        category: 'permits'
      },
      {
        title: 'Excavation',
        description: 'Excavate pool area',
        priority: 'high',
        estimatedDays: 3,
        category: 'earthwork'
      },
      {
        title: 'Pool Shell Construction',
        description: 'Build reinforced concrete pool shell',
        priority: 'high',
        estimatedDays: 10,
        category: 'construction'
      },
      {
        title: 'Plumbing and Filtration',
        description: 'Install pool plumbing and filtration system',
        priority: 'high',
        estimatedDays: 5,
        category: 'plumbing'
      },
      {
        title: 'Pool Finish',
        description: 'Apply pool finish (tiles or liner)',
        priority: 'medium',
        estimatedDays: 7,
        category: 'finishing'
      },
      {
        title: 'Decking and Landscaping',
        description: 'Install pool decking and landscaping',
        priority: 'low',
        estimatedDays: 10,
        category: 'landscaping'
      }
    ],
    suggestedDocuments: [
      'Site survey report',
      'Pool design plans',
      'Building permits',
      'Structural calculations',
      'Equipment specifications',
      'Safety compliance certificate'
    ]
  }
]

// Get template by ID
export function getProjectTemplate(templateId: string): ProjectTemplate | undefined {
  return projectTemplates.find(template => template.id === templateId)
}

// Get templates by category
export function getTemplatesByCategory(category: string): ProjectTemplate[] {
  return projectTemplates.filter(template => template.category === category)
}

// Calculate estimated end date based on start date and duration
export function calculateEndDate(startDate: string, durationDays: number): string {
  const start = new Date(startDate)
  const end = new Date(start)
  end.setDate(end.getDate() + durationDays)
  return end.toISOString().split('T')[0]
}

// Generate tasks with proper dates
export function generateTasksFromTemplate(
  template: ProjectTemplate,
  projectStartDate: string
): Array<{
  title: string
  description: string
  priority: string
  due_date: string
  status: string
}> {
  let currentDate = new Date(projectStartDate)
  
  return template.tasks.map(task => {
    // Calculate due date based on estimated days
    const dueDate = new Date(currentDate)
    dueDate.setDate(dueDate.getDate() + task.estimatedDays)
    
    // Move current date forward for next task
    currentDate = new Date(dueDate)
    
    return {
      title: task.title,
      description: task.description,
      priority: task.priority,
      due_date: dueDate.toISOString().split('T')[0],
      status: 'pending'
    }
  })
}
