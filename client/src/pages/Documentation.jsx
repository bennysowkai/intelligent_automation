import { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import StatusBadge from '../components/StatusBadge';

const Documentation = () => {
  const [docTasks, setDocTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [generatingAI, setGeneratingAI] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    automationId: '',
    status: 'Draft',
  });

  const loadDocTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getDocTasks();
      setDocTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createDocTask(formData);
      setFormData({
        title: '',
        description: '',
        automationId: '',
        status: 'Draft',
      });
      setShowForm(false);
      loadDocTasks();
    } catch (err) {
      alert('Failed to create documentation task: ' + err.message);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.updateDocTask(id, { status: newStatus });
      loadDocTasks();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this documentation task?')) return;

    try {
      await api.deleteDocTask(id);
      loadDocTasks();
    } catch (err) {
      alert('Failed to delete task: ' + err.message);
    }
  };

  const generateAISuggestion = async () => {
    if (!formData.title) {
      alert('Please enter a title first');
      return;
    }

    try {
      setGeneratingAI(true);
      const response = await api.generateAISuggestion({
        title: formData.title,
        description: formData.description,
      });
      setAiSuggestion(response.suggestion);
      setShowAIPanel(true);
    } catch (err) {
      alert('Failed to generate AI suggestion: ' + err.message);
    } finally {
      setGeneratingAI(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading documentation tasks..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadDocTasks} />;

  const statusCounts = {
    Draft: docTasks.filter((d) => d.status === 'Draft').length,
    'In Review': docTasks.filter((d) => d.status === 'In Review').length,
    Approved: docTasks.filter((d) => d.status === 'Approved').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">HOTs Documentation</h1>
          <p className="text-gray-600 mt-1">
            AI-assisted documentation for automation projects
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : '+ New Doc Task'}
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-2xl font-bold text-purple-600">{statusCounts.Draft}</p>
          <p className="text-sm text-gray-600 mt-1">Draft</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-blue-600">{statusCounts['In Review']}</p>
          <p className="text-sm text-gray-600 mt-1">In Review</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-green-600">{statusCounts.Approved}</p>
          <p className="text-sm text-gray-600 mt-1">Approved</p>
        </div>
      </div>

      {/* Form with AI Assistance */}
      {showForm && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card">
            <h2 className="text-xl font-semibold mb-4">Create Documentation Task</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Document Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                  rows="4"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Automation ID</label>
                  <input
                    type="number"
                    value={formData.automationId}
                    onChange={(e) =>
                      setFormData({ ...formData, automationId: e.target.value })
                    }
                    className="input"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="label">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="input"
                  >
                    <option value="Draft">Draft</option>
                    <option value="In Review">In Review</option>
                    <option value="Approved">Approved</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3">
                <button type="submit" className="btn btn-primary">
                  Create Task
                </button>
                <button
                  type="button"
                  onClick={generateAISuggestion}
                  disabled={generatingAI}
                  className="btn bg-purple-600 text-white hover:bg-purple-700"
                >
                  {generatingAI ? 'Generating...' : '✨ Generate AI Suggestion'}
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

          {/* AI Suggestion Panel */}
          {showAIPanel && (
            <div className="card bg-purple-50 border-2 border-purple-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-purple-900">✨ AI Suggestion</h3>
                <button
                  onClick={() => setShowAIPanel(false)}
                  className="text-purple-600 hover:text-purple-800"
                >
                  ✕
                </button>
              </div>
              <div className="bg-white rounded p-4 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                  {aiSuggestion}
                </pre>
              </div>
              <p className="text-xs text-purple-700 mt-3">
                This is a mock AI-generated documentation template. In production,
                this would integrate with a real AI service.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Documentation Tasks List */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Documentation Tasks</h2>
        <div className="space-y-3">
          {docTasks.map((task) => (
            <div
              key={task.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold text-gray-900">{task.title}</h3>
                    <StatusBadge status={task.status} />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    {task.automationId && (
                      <span>Automation ID: {task.automationId}</span>
                    )}
                    <span>Last updated: {task.lastUpdated}</span>
                  </div>
                </div>
                <div className="ml-4 flex items-center space-x-3">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="Draft">Draft</option>
                    <option value="In Review">In Review</option>
                    <option value="Approved">Approved</option>
                  </select>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {docTasks.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No documentation tasks yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Documentation;
