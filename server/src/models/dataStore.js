/**
 * In-memory data store for the Intelligent Automation Hub
 * In a production environment, this would be replaced with a proper database
 */

class DataStore {
  constructor() {
    this.onboardingTasks = [];
    this.surveys = [];
    this.docTasks = [];
    this.workItems = [];
    this.governanceChecks = [];
    this.users = [];

    this.initializeData();
  }

  initializeData() {
    // Seed users - single demo account
    this.users = [
      { id: 1, username: 'demo', name: 'Demo User', role: 'User', password: 'demo' }
    ];

    // Seed onboarding tasks
    this.onboardingTasks = [
      {
        id: 1,
        title: 'Set up Power Platform environment access',
        description: 'Grant developer access to the development environment',
        category: 'Access',
        status: 'Completed',
        assignee: 'John Doe',
        dueDate: '2025-11-15',
        createdDate: '2025-11-01'
      },
      {
        id: 2,
        title: 'Complete Automation Fundamentals training',
        description: 'Complete the online training course on automation best practices',
        category: 'Training',
        status: 'In Progress',
        assignee: 'Jane Smith',
        dueDate: '2025-11-25',
        createdDate: '2025-11-10'
      },
      {
        id: 3,
        title: 'Install development tools',
        description: 'Install VS Code, Git, and required extensions',
        category: 'Tools',
        status: 'Completed',
        assignee: 'John Doe',
        dueDate: '2025-11-12',
        createdDate: '2025-11-01'
      },
      {
        id: 4,
        title: 'Azure DevOps access setup',
        description: 'Create Azure DevOps account and add to project',
        category: 'Access',
        status: 'Pending',
        assignee: 'Mike Johnson',
        dueDate: '2025-11-30',
        createdDate: '2025-11-18'
      },
      {
        id: 5,
        title: 'Review governance documentation',
        description: 'Read and acknowledge governance policies',
        category: 'Training',
        status: 'In Progress',
        assignee: 'Jane Smith',
        dueDate: '2025-11-22',
        createdDate: '2025-11-15'
      }
    ];

    // Seed surveys
    this.surveys = [
      {
        id: 1,
        projectName: 'Invoice Processing Automation',
        respondentName: 'Sarah Williams',
        rating: 5,
        comments: 'Excellent automation! Saved us 20 hours per week.',
        date: '2025-10-15'
      },
      {
        id: 2,
        projectName: 'Employee Onboarding Bot',
        respondentName: 'Mark Davis',
        rating: 4,
        comments: 'Very helpful, minor issues with email notifications.',
        date: '2025-10-20'
      },
      {
        id: 3,
        projectName: 'Expense Report Automation',
        respondentName: 'Lisa Anderson',
        rating: 5,
        comments: 'Perfect! No more manual data entry.',
        date: '2025-11-01'
      },
      {
        id: 4,
        projectName: 'Contract Approval Workflow',
        respondentName: 'Tom Brown',
        rating: 3,
        comments: 'Good start, needs better integration with legal system.',
        date: '2025-11-05'
      },
      {
        id: 5,
        projectName: 'Inventory Sync Automation',
        respondentName: 'Emily White',
        rating: 5,
        comments: 'Fantastic! Real-time updates are a game changer.',
        date: '2025-11-10'
      },
      {
        id: 6,
        projectName: 'Report Generation Bot',
        respondentName: 'Chris Green',
        rating: 4,
        comments: 'Saves time, would like more customization options.',
        date: '2025-11-12'
      }
    ];

    // Seed documentation tasks
    this.docTasks = [
      {
        id: 1,
        title: 'Document Invoice Processing Automation',
        description: 'Create comprehensive documentation for the invoice processing bot',
        automationId: 1,
        status: 'Approved',
        lastUpdated: '2025-10-30',
        createdDate: '2025-10-01'
      },
      {
        id: 2,
        title: 'API Integration Guide',
        description: 'Document how to integrate with external APIs',
        automationId: 3,
        status: 'In Review',
        lastUpdated: '2025-11-15',
        createdDate: '2025-11-01'
      },
      {
        id: 3,
        title: 'Error Handling Best Practices',
        description: 'Create guidelines for error handling in automations',
        automationId: null,
        status: 'Draft',
        lastUpdated: '2025-11-18',
        createdDate: '2025-11-10'
      },
      {
        id: 4,
        title: 'Security Guidelines for Automation',
        description: 'Document security best practices for automation development',
        automationId: null,
        status: 'Draft',
        lastUpdated: '2025-11-17',
        createdDate: '2025-11-15'
      }
    ];

    // Seed work items
    this.workItems = [
      {
        id: 1,
        name: 'Invoice Processing Automation',
        businessOwner: 'Finance Team',
        status: 'Live',
        priority: 'High',
        createdDate: '2025-08-01',
        targetGoLiveDate: '2025-10-01',
        actualGoLiveDate: '2025-09-28'
      },
      {
        id: 2,
        name: 'Employee Onboarding Bot',
        businessOwner: 'HR Department',
        status: 'Live',
        priority: 'Medium',
        createdDate: '2025-08-15',
        targetGoLiveDate: '2025-10-15',
        actualGoLiveDate: '2025-10-18'
      },
      {
        id: 3,
        name: 'Contract Approval Workflow',
        businessOwner: 'Legal Team',
        status: 'In Delivery',
        priority: 'High',
        createdDate: '2025-09-01',
        targetGoLiveDate: '2025-12-01',
        actualGoLiveDate: null
      },
      {
        id: 4,
        name: 'Supply Chain Dashboard Automation',
        businessOwner: 'Operations',
        status: 'In Delivery',
        priority: 'High',
        createdDate: '2025-10-01',
        targetGoLiveDate: '2025-12-15',
        actualGoLiveDate: null
      },
      {
        id: 5,
        name: 'Customer Service Bot Enhancement',
        businessOwner: 'Customer Service',
        status: 'Discovery',
        priority: 'Medium',
        createdDate: '2025-10-15',
        targetGoLiveDate: '2026-01-30',
        actualGoLiveDate: null
      },
      {
        id: 6,
        name: 'Data Migration Tool',
        businessOwner: 'IT Department',
        status: 'Idea',
        priority: 'Low',
        createdDate: '2025-11-01',
        targetGoLiveDate: '2026-03-01',
        actualGoLiveDate: null
      },
      {
        id: 7,
        name: 'Quality Assurance Automation',
        businessOwner: 'QA Team',
        status: 'On Hold',
        priority: 'Medium',
        createdDate: '2025-09-15',
        targetGoLiveDate: null,
        actualGoLiveDate: null
      }
    ];

    // Seed governance checks
    this.governanceChecks = [
      {
        id: 1,
        name: 'Data Privacy Compliance Review',
        description: 'Ensure all automations comply with data privacy regulations',
        type: 'Policy',
        status: 'Implemented',
        createdDate: '2025-08-01',
        lastReviewDate: '2025-11-01'
      },
      {
        id: 2,
        name: 'Security Audit Checklist',
        description: 'Complete security audit for all production automations',
        type: 'Checklist',
        status: 'In Progress',
        createdDate: '2025-09-01',
        lastReviewDate: '2025-11-15'
      },
      {
        id: 3,
        name: 'Access Control Implementation',
        description: 'Implement role-based access control for all environments',
        type: 'Control',
        status: 'Implemented',
        createdDate: '2025-07-01',
        lastReviewDate: '2025-10-01'
      },
      {
        id: 4,
        name: 'Change Management Process',
        description: 'Establish formal change management process',
        type: 'Policy',
        status: 'In Progress',
        createdDate: '2025-10-01',
        lastReviewDate: '2025-11-10'
      },
      {
        id: 5,
        name: 'Disaster Recovery Plan',
        description: 'Create and test disaster recovery procedures',
        type: 'Control',
        status: 'Not Started',
        createdDate: '2025-11-01',
        lastReviewDate: null
      },
      {
        id: 6,
        name: 'Documentation Standards',
        description: 'Define and enforce documentation standards',
        type: 'Policy',
        status: 'Implemented',
        createdDate: '2025-08-15',
        lastReviewDate: '2025-11-01'
      }
    ];
  }

  // Generic CRUD operations
  getAll(collection) {
    return [...this[collection]];
  }

  getById(collection, id) {
    return this[collection].find(item => item.id === parseInt(id));
  }

  create(collection, data) {
    const newId = this[collection].length > 0
      ? Math.max(...this[collection].map(item => item.id)) + 1
      : 1;
    const newItem = { id: newId, ...data };
    this[collection].push(newItem);
    return newItem;
  }

  update(collection, id, data) {
    const index = this[collection].findIndex(item => item.id === parseInt(id));
    if (index === -1) return null;

    this[collection][index] = { ...this[collection][index], ...data, id: parseInt(id) };
    return this[collection][index];
  }

  delete(collection, id) {
    const index = this[collection].findIndex(item => item.id === parseInt(id));
    if (index === -1) return false;

    this[collection].splice(index, 1);
    return true;
  }

  // User authentication
  findUserByCredentials(username, password) {
    return this.users.find(u => u.username === username && u.password === password);
  }
}

// Singleton instance
const dataStore = new DataStore();

export default dataStore;
