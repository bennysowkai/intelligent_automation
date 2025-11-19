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
  const [editingTask, setEditingTask] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
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
      if (editingTask) {
        await api.updateDocTask(editingTask.id, formData);
      } else {
        await api.createDocTask(formData);
      }
      setFormData({
        title: '',
        description: '',
        automationId: '',
        status: 'Draft',
      });
      setShowForm(false);
      setEditingTask(null);
      setAiSuggestion('');
      loadDocTasks();
    } catch (err) {
      alert('Failed to save documentation task: ' + err.message);
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

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      automationId: task.automationId || '',
      status: task.status,
    });
    setShowForm(true);
    setShowPreview(false);
    setAiSuggestion('');
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      automationId: '',
      status: 'Draft',
    });
    setShowForm(false);
    setAiSuggestion('');
    setShowPreview(false);
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
      setShowPreview(true);
    } catch (err) {
      alert('Failed to generate AI suggestion: ' + err.message);
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleUseAISuggestion = () => {
    setFormData({ ...formData, description: aiSuggestion });
    setShowPreview(false);
    setAiSuggestion('');
  };

  const togglePreview = () => {
    if (!showPreview && formData.description) {
      setPreviewContent(formData.description);
    }
    setShowPreview(!showPreview);
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
          onClick={() => {
            if (showForm) {
              handleCancelEdit();
            } else {
              setShowForm(true);
            }
          }}
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

      {/* Form with Preview/Edit */}
      {showForm && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {editingTask ? 'Edit Documentation Task' : 'Create Documentation Task'}
            </h2>
            <div className="flex space-x-2">
              {formData.description && (
                <button
                  onClick={togglePreview}
                  className={`btn text-sm ${
                    showPreview ? 'bg-purple-600 text-white' : 'btn-secondary'
                  }`}
                >
                  {showPreview ? '📝 Edit' : '👁️ Preview'}
                </button>
              )}
              <button
                onClick={generateAISuggestion}
                disabled={generatingAI}
                className="btn bg-purple-600 text-white hover:bg-purple-700 text-sm"
              >
                {generatingAI ? 'Generating...' : '✨ AI Suggestion'}
              </button>
            </div>
          </div>

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
              <label className="label">
                Description {showPreview ? '(Preview Mode)' : '(Edit Mode)'}
              </label>

              {!showPreview ? (
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="input font-mono text-sm"
                  rows="12"
                  placeholder="Write your documentation here... Supports markdown formatting."
                />
              ) : (
                <div className="border border-gray-300 rounded-lg p-4 bg-white min-h-64 max-h-96 overflow-y-auto">
                  <div className="prose prose-sm max-w-none">
                    {formData.description.split('\n').map((line, idx) => {
                      // Simple markdown rendering
                      if (line.startsWith('# ')) {
                        return <h1 key={idx} className="text-2xl font-bold mt-4 mb-2">{line.substring(2)}</h1>;
                      } else if (line.startsWith('## ')) {
                        return <h2 key={idx} className="text-xl font-bold mt-3 mb-2">{line.substring(3)}</h2>;
                      } else if (line.startsWith('### ')) {
                        return <h3 key={idx} className="text-lg font-semibold mt-2 mb-1">{line.substring(4)}</h3>;
                      } else if (line.startsWith('- ')) {
                        return <li key={idx} className="ml-4">{line.substring(2)}</li>;
                      } else if (line.startsWith('**') && line.endsWith('**')) {
                        return <p key={idx} className="font-bold">{line.substring(2, line.length - 2)}</p>;
                      } else if (line.trim() === '') {
                        return <br key={idx} />;
                      } else {
                        return <p key={idx} className="mb-2">{line}</p>;
                      }
                    })}
                  </div>
                </div>
              )}
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
                {editingTask ? 'Update Task' : 'Create Task'}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* AI Suggestion Modal */}
          {aiSuggestion && (
            <div className="mt-6 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-purple-900">✨ AI Generated Suggestion</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={handleUseAISuggestion}
                    className="btn btn-sm bg-purple-600 text-white hover:bg-purple-700"
                  >
                    Use This
                  </button>
                  <button
                    onClick={() => setAiSuggestion('')}
                    className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
              <div className="bg-white rounded p-4 max-h-64 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                  {aiSuggestion}
                </pre>
              </div>
              <p className="text-xs text-purple-700 mt-2">
                Click "Use This" to copy this content to the description field, or edit it manually.
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
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{task.title}</h3>
                    <StatusBadge status={task.status} />
                  </div>
                  {task.description && (
                    <div className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {task.description.substring(0, 150)}
                      {task.description.length > 150 && '...'}
                    </div>
                  )}
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    {task.automationId && (
                      <span>Automation ID: {task.automationId}</span>
                    )}
                    <span>Last updated: {task.lastUpdated}</span>
                  </div>
                </div>
                <div className="ml-4 flex items-center space-x-3">
                  <button
                    onClick={() => handleEdit(task)}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Edit
                  </button>
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
