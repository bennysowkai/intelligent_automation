import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import StatCard from '../components/StatCard';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getDashboardSummary();
      setSummary(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadData} />;
  if (!summary) return null;

  // Prepare chart data
  const workItemsChartData = Object.entries(summary.workItems.byStatus).map(
    ([status, count]) => ({
      status,
      count,
    })
  );

  const onboardingChartData = Object.entries(summary.onboardingTasks.byStatus).map(
    ([status, count]) => ({
      status,
      count,
    })
  );

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Overview of Intelligent Automation activities
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Work Items"
          value={summary.workItems.total}
          icon="📋"
          color="blue"
        />
        <StatCard
          title="Onboarding Tasks"
          value={summary.onboardingTasks.total}
          icon="🚀"
          color="purple"
        />
        <StatCard
          title="Average Satisfaction"
          value={summary.surveys.averageRating.toFixed(1)}
          icon="⭐"
          color="yellow"
        />
        <StatCard
          title="Documentation Tasks"
          value={summary.docTasks.total}
          icon="📚"
          color="green"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Work Items by Status */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Work Items by Status
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={workItemsChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Onboarding Tasks */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Onboarding Tasks Status
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={onboardingChartData}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {onboardingChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Surveys and Upcoming Go-Lives */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Surveys */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Satisfaction Surveys
          </h2>
          <div className="space-y-3">
            {summary.surveys.recent.map((survey) => (
              <div
                key={survey.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{survey.projectName}</p>
                  <p className="text-sm text-gray-600">{survey.respondentName}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-500">⭐</span>
                  <span className="font-semibold text-gray-900">{survey.rating}</span>
                </div>
              </div>
            ))}
            {summary.surveys.recent.length === 0 && (
              <p className="text-gray-500 text-center py-4">No surveys yet</p>
            )}
          </div>
          <Link
            to="/surveys"
            className="block mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View all surveys →
          </Link>
        </div>

        {/* Upcoming Go-Lives */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Upcoming Go-Live Dates
          </h2>
          <div className="space-y-3">
            {summary.upcomingGoLives.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.status}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(item.targetDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {summary.upcomingGoLives.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No upcoming go-live dates
              </p>
            )}
          </div>
          <Link
            to="/work-items"
            className="block mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View all work items →
          </Link>
        </div>
      </div>

      {/* Governance Status */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Governance Overview
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-3xl font-bold text-red-600">
              {summary.governance.byStatus['Not Started'] || 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">Not Started</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-3xl font-bold text-yellow-600">
              {summary.governance.byStatus['In Progress'] || 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">In Progress</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">
              {summary.governance.byStatus['Implemented'] || 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">Implemented</p>
          </div>
        </div>
        <Link
          to="/governance"
          className="block mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          View governance checks →
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
