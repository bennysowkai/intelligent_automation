import dataStore from '../models/dataStore.js';

export const getDashboardSummary = (req, res) => {
  try {
    const workItems = dataStore.getAll('workItems');
    const onboardingTasks = dataStore.getAll('onboardingTasks');
    const surveys = dataStore.getAll('surveys');
    const docTasks = dataStore.getAll('docTasks');
    const governanceChecks = dataStore.getAll('governanceChecks');

    // Work items summary
    const workItemsByStatus = {
      Idea: workItems.filter(wi => wi.status === 'Idea').length,
      Discovery: workItems.filter(wi => wi.status === 'Discovery').length,
      'In Delivery': workItems.filter(wi => wi.status === 'In Delivery').length,
      Live: workItems.filter(wi => wi.status === 'Live').length,
      'On Hold': workItems.filter(wi => wi.status === 'On Hold').length
    };

    // Onboarding tasks summary
    const onboardingTasksByStatus = {
      Pending: onboardingTasks.filter(t => t.status === 'Pending').length,
      'In Progress': onboardingTasks.filter(t => t.status === 'In Progress').length,
      Completed: onboardingTasks.filter(t => t.status === 'Completed').length
    };

    // Survey statistics
    const averageRating = surveys.length > 0
      ? (surveys.reduce((sum, s) => sum + s.rating, 0) / surveys.length).toFixed(2)
      : 0;

    const recentSurveys = surveys
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    // Documentation tasks summary
    const docTasksByStatus = {
      Draft: docTasks.filter(d => d.status === 'Draft').length,
      'In Review': docTasks.filter(d => d.status === 'In Review').length,
      Approved: docTasks.filter(d => d.status === 'Approved').length
    };

    // Governance summary
    const governanceByStatus = {
      'Not Started': governanceChecks.filter(g => g.status === 'Not Started').length,
      'In Progress': governanceChecks.filter(g => g.status === 'In Progress').length,
      Implemented: governanceChecks.filter(g => g.status === 'Implemented').length
    };

    // Upcoming go-live dates
    const upcomingGoLives = workItems
      .filter(wi => wi.targetGoLiveDate && !wi.actualGoLiveDate)
      .sort((a, b) => new Date(a.targetGoLiveDate) - new Date(b.targetGoLiveDate))
      .slice(0, 3)
      .map(wi => ({
        id: wi.id,
        name: wi.name,
        targetDate: wi.targetGoLiveDate,
        status: wi.status
      }));

    res.json({
      workItems: {
        total: workItems.length,
        byStatus: workItemsByStatus
      },
      onboardingTasks: {
        total: onboardingTasks.length,
        byStatus: onboardingTasksByStatus
      },
      surveys: {
        total: surveys.length,
        averageRating: parseFloat(averageRating),
        recent: recentSurveys
      },
      docTasks: {
        total: docTasks.length,
        byStatus: docTasksByStatus
      },
      governance: {
        total: governanceChecks.length,
        byStatus: governanceByStatus
      },
      upcomingGoLives
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate dashboard summary' });
  }
};
