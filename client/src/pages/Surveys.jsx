import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Surveys = () => {
  const [surveys, setSurveys] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    projectName: '',
    respondentName: '',
    rating: 5,
    comments: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [surveysData, statsData] = await Promise.all([
        api.getSurveys(),
        api.getSurveyStats(),
      ]);
      setSurveys(surveysData);
      setStats(statsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createSurvey(formData);
      setFormData({
        projectName: '',
        respondentName: '',
        rating: 5,
        comments: '',
      });
      setShowForm(false);
      loadData();
    } catch (err) {
      alert('Failed to submit survey: ' + err.message);
    }
  };

  if (loading) return <LoadingSpinner message="Loading surveys..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadData} />;

  const ratingChartData = Object.entries(stats.ratingDistribution).map(
    ([rating, count]) => ({
      rating: `${rating} Stars`,
      count,
    })
  );

  const getRatingStars = (rating) => {
    return '⭐'.repeat(rating);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Satisfaction Surveys</h1>
          <p className="text-gray-600 mt-1">
            End-of-delivery satisfaction feedback from stakeholders
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : '+ New Survey'}
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <p className="text-4xl font-bold text-primary-600">{stats.total}</p>
          <p className="text-sm text-gray-600 mt-1">Total Surveys</p>
        </div>
        <div className="card text-center">
          <p className="text-4xl font-bold text-yellow-600">{stats.averageRating}</p>
          <p className="text-sm text-gray-600 mt-1">Average Rating</p>
        </div>
        <div className="card text-center">
          <p className="text-4xl">⭐</p>
          <p className="text-sm text-gray-600 mt-1">Out of 5</p>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Submit New Survey</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Project Name *</label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) =>
                    setFormData({ ...formData, projectName: e.target.value })
                  }
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">Your Name *</label>
                <input
                  type="text"
                  value={formData.respondentName}
                  onChange={(e) =>
                    setFormData({ ...formData, respondentName: e.target.value })
                  }
                  className="input"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Rating * ({formData.rating}/5)</label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData({ ...formData, rating: parseInt(e.target.value) })
                  }
                  className="flex-1"
                />
                <span className="text-2xl">{getRatingStars(formData.rating)}</span>
              </div>
            </div>

            <div>
              <label className="label">Comments</label>
              <textarea
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                className="input"
                rows="4"
                placeholder="Share your experience with this automation project..."
              />
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn btn-primary">
                Submit Survey
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rating Distribution Chart */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Rating Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ratingChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="rating" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Surveys List */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">All Surveys</h2>
        <div className="space-y-4">
          {surveys.map((survey) => (
            <div
              key={survey.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {survey.projectName}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    by {survey.respondentName} on {survey.date}
                  </p>
                  {survey.comments && (
                    <p className="text-sm text-gray-700 mt-2 italic">
                      "{survey.comments}"
                    </p>
                  )}
                </div>
                <div className="ml-4 flex items-center space-x-2">
                  <span className="text-2xl">{getRatingStars(survey.rating)}</span>
                  <span className="text-lg font-bold text-gray-900">
                    {survey.rating}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {surveys.length === 0 && (
            <p className="text-center text-gray-500 py-8">No surveys yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Surveys;
