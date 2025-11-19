import { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import StatusBadge from '../components/StatusBadge';

const Governance = () => {
  const [checks, setChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('All');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'Policy',
    status: 'Not Started',
  });

  const loadChecks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getGovernanceChecks();
      setChecks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChecks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createGovernanceCheck(formData);
      setFormData({
        name: '',
        description: '',
        type: 'Policy',
        status: 'Not Started',
      });
      setShowForm(false);
      loadChecks();
    } catch (err) {
      alert('Failed to create governance check: ' + err.message);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.updateGovernanceCheck(id, { status: newStatus });
      loadChecks();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this governance check?')) return;

    try {
      await api.deleteGovernanceCheck(id);
      loadChecks();
    } catch (err) {
      alert('Failed to delete check: ' + err.message);
    }
  };

  if (loading) return <LoadingSpinner message="Loading governance checks..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadChecks} />;

  const filteredChecks = filter === 'All'
    ? checks
    : checks.filter((check) => check.type === filter);

  const statusCounts = {
    'Not Started': checks.filter((c) => c.status === 'Not Started').length,
    'In Progress': checks.filter((c) => c.status === 'In Progress').length,
    Implemented: checks.filter((c) => c.status === 'Implemented').length,
  };

  const notStartedChecks = checks.filter((c) => c.status === 'Not Started');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Governance & Compliance</h1>
          <p className="text-gray-600 mt-1">
            Manage governance policies, controls, and compliance checklists
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : '+ New Check'}
        </button>
      </div>

      {/* Alert for Not Started Checks */}
      {notStartedChecks.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-start">
            <span className="text-2xl mr-3">⚠️</span>
            <div>
              <h3 className="font-semibold text-red-800">
                {notStartedChecks.length} governance check(s) not yet started
              </h3>
              <p className="text-sm text-red-700 mt-1">
                Review and start implementation of pending governance items to maintain
                compliance.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-2xl font-bold text-red-600">
            {statusCounts['Not Started']}
          </p>
          <p className="text-sm text-gray-600 mt-1">Not Started</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {statusCounts['In Progress']}
          </p>
          <p className="text-sm text-gray-600 mt-1">In Progress</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-green-600">
            {statusCounts.Implemented}
          </p>
          <p className="text-sm text-gray-600 mt-1">Implemented</p>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Create Governance Check</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Check Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="input"
                rows="3"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="input"
                  required
                >
                  <option value="Policy">Policy</option>
                  <option value="Control">Control</option>
                  <option value="Checklist">Checklist</option>
                </select>
              </div>
              <div>
                <label className="label">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="input"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Implemented">Implemented</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn btn-primary">
                Create Check
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

      {/* Filters */}
      <div className="flex space-x-2">
        {['All', 'Policy', 'Control', 'Checklist'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === type
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Checks List */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Governance Checks</h2>
        <div className="space-y-3">
          {filteredChecks.map((check) => (
            <div
              key={check.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{check.name}</h3>
                    <span className="badge bg-indigo-100 text-indigo-800">
                      {check.type}
                    </span>
                    <StatusBadge status={check.status} />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{check.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Created: {check.createdDate}</span>
                    {check.lastReviewDate && (
                      <span>Last reviewed: {check.lastReviewDate}</span>
                    )}
                  </div>
                </div>
                <div className="ml-4 flex items-center space-x-3">
                  <select
                    value={check.status}
                    onChange={(e) => handleStatusChange(check.id, e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Implemented">Implemented</option>
                  </select>
                  <button
                    onClick={() => handleDelete(check.id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredChecks.length === 0 && (
            <p className="text-center text-gray-500 py-8">No checks found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Governance;
