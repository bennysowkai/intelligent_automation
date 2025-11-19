/**
 * SharePoint Migration Controller
 * Mock implementation of Microsoft Graph API integration
 * In production, this would use @microsoft/microsoft-graph-client
 */

// Mock SharePoint data
const mockSites = [
  {
    id: 'site-1',
    name: 'Intelligent Automation Team Site',
    webUrl: 'https://fonterra.sharepoint.com/sites/intelligentautomation',
    description: 'Main team site for Intelligent Automation',
    createdDateTime: '2024-01-15T10:00:00Z',
    lastModifiedDateTime: '2025-11-18T14:30:00Z'
  },
  {
    id: 'site-2',
    name: 'Automation Documentation',
    webUrl: 'https://fonterra.sharepoint.com/sites/automation-docs',
    description: 'Central repository for automation documentation',
    createdDateTime: '2024-02-01T09:00:00Z',
    lastModifiedDateTime: '2025-11-17T16:45:00Z'
  },
  {
    id: 'site-3',
    name: 'Project Archives',
    webUrl: 'https://fonterra.sharepoint.com/sites/project-archives',
    description: 'Archive of completed automation projects',
    createdDateTime: '2023-06-10T11:00:00Z',
    lastModifiedDateTime: '2025-10-05T13:20:00Z'
  }
];

const mockSiteContent = {
  'site-1': [
    {
      id: 'folder-1',
      name: 'Governance Documents',
      type: 'folder',
      size: null,
      lastModified: '2025-11-15T10:00:00Z',
      itemCount: 12
    },
    {
      id: 'folder-2',
      name: 'Meeting Notes',
      type: 'folder',
      size: null,
      lastModified: '2025-11-18T09:30:00Z',
      itemCount: 45
    },
    {
      id: 'file-1',
      name: 'Team Charter.docx',
      type: 'file',
      size: 245760,
      lastModified: '2025-09-20T14:15:00Z',
      itemCount: null
    },
    {
      id: 'file-2',
      name: 'Automation Standards.pdf',
      type: 'file',
      size: 1048576,
      lastModified: '2025-11-10T11:30:00Z',
      itemCount: null
    }
  ],
  'site-2': [
    {
      id: 'folder-3',
      name: 'API Documentation',
      type: 'folder',
      size: null,
      lastModified: '2025-11-12T13:00:00Z',
      itemCount: 8
    },
    {
      id: 'folder-4',
      name: 'User Guides',
      type: 'folder',
      size: null,
      lastModified: '2025-11-16T15:45:00Z',
      itemCount: 23
    },
    {
      id: 'file-3',
      name: 'Quick Start Guide.pdf',
      type: 'file',
      size: 524288,
      lastModified: '2025-11-05T10:00:00Z',
      itemCount: null
    }
  ],
  'site-3': [
    {
      id: 'folder-5',
      name: '2024 Projects',
      type: 'folder',
      size: null,
      lastModified: '2024-12-31T23:59:00Z',
      itemCount: 34
    },
    {
      id: 'folder-6',
      name: '2025 Projects',
      type: 'folder',
      size: null,
      lastModified: '2025-11-01T12:00:00Z',
      itemCount: 18
    }
  ]
};

export const listSites = (req, res) => {
  try {
    // In production, this would call: graphClient.api('/sites').get()
    console.log('Mock Graph API: Listing SharePoint sites');

    res.json({
      value: mockSites,
      '@odata.context': 'https://graph.microsoft.com/v1.0/$metadata#sites',
      mock: true
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch SharePoint sites' });
  }
};

export const getSiteById = (req, res) => {
  try {
    const { id } = req.params;
    const site = mockSites.find(s => s.id === id);

    if (!site) {
      return res.status(404).json({ error: 'Site not found' });
    }

    console.log(`Mock Graph API: Fetching site ${id}`);

    res.json({
      ...site,
      mock: true
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch site' });
  }
};

export const getSiteContent = (req, res) => {
  try {
    const { id } = req.params;
    const content = mockSiteContent[id];

    if (!content) {
      return res.status(404).json({ error: 'Site content not found' });
    }

    console.log(`Mock Graph API: Fetching content for site ${id}`);

    res.json({
      value: content,
      '@odata.context': 'https://graph.microsoft.com/v1.0/$metadata#sites/items',
      mock: true
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch site content' });
  }
};

export const getGraphConfig = (req, res) => {
  try {
    res.json({
      tenantId: process.env.GRAPH_TENANT_ID || 'mock-tenant-id',
      clientId: process.env.GRAPH_CLIENT_ID || 'mock-client-id',
      baseUrl: process.env.GRAPH_BASE_URL || 'https://graph.microsoft.com/v1.0',
      configured: false,
      note: 'This is a mock implementation. Configure real Graph API credentials in .env for production use.'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Graph configuration' });
  }
};
