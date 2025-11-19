import { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import StatusBadge from '../components/StatusBadge';

const WorkItems = () => {
  const [workItems, setWorkItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'
  const [formData, setFormData] = useState({
    name: '',
    businessOwner: '',
    status: 'Idea',
    priority: 'Medium',
    targetGoLiveDate: '',
  });

  const loadWorkItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getWorkItems();
      setWorkItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createWorkItem(formData);
      setFormData({
        name: '',
        businessOwner: '',
        status: 'Idea',
        priority: 'Medium',
        targetGoLiveDate: '',
      });
      setShowForm(false);
      loadWorkItems();
    } catch (err) {
      alert('Failed to create work item: ' + err.message);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.updateWorkItem(id, { status: newStatus });
      loadWorkItems();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handlePriorityChange = async (id, newPriority) => {
    try {
      await api.updateWorkItem(id, { priority: newPriority });
      loadWorkItems();
    } catch (err) {
      alert('Failed to update priority: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this work item?')) return;

    try {
      await api.deleteWorkItem(id);
      loadWorkItems();
    } catch (err) {
      alert('Failed to delete work item: ' + err.message);
    }
  };

  if (loading) return <LoadingSpinner message="Loading work items..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadWorkItems} />;

  const statuses = ['Idea', 'Discovery', 'In Delivery', 'Live', 'On Hold'];
  const groupedItems = statuses.reduce((acc, status) => {
    acc[status] = workItems.filter((item) => item.status === status);
    return acc;
  }, {});

  const getPriorityColor = (priority) => {
    const colors = {
      High: 'bg-red-100 text-red-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      Low: 'bg-green-100 text-green-800',
    };
    return colors[priority] || colors.Medium;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Work Item Tracker</h1>
          <p className="text-gray-600 mt-1">
            Track and manage intelligent automation initiatives
          </p>
        </div>
        <div className="flex space-x-3">
          <div className="flex rounded-lg border border-gray-300">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === 'kanban'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === 'list'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              List
            </button>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? 'Cancel' : '+ New Work Item'}
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Create Work Item</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Project Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">Business Owner *</label>
                <input
                  type="text"
                  value={formData.businessOwner}
                  onChange={(e) =>
                    setFormData({ ...formData, businessOwner: e.target.value })
                  }
                  className="input"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="label">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="input"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                  className="input"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="label">Target Go-Live Date</label>
                <input
                  type="date"
                  value={formData.targetGoLiveDate}
                  onChange={(e) =>
                    setFormData({ ...formData, targetGoLiveDate: e.target.value })
                  }
                  className="input"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn btn-primary">
                Create Work Item
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

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-5 gap-4">
          {statuses.map((status) => (
            <div key={status} className="bg-gray-100 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                {status}
                <span className="ml-2 text-sm text-gray-500">
                  ({groupedItems[status].length})
                </span>
              </h3>
              <div className="space-y-3">
                {groupedItems[status].map((item) => (
                  <div key={item.id} className="bg-white rounded-lg p-3 shadow-sm">
                    <h4 className="font-medium text-gray-900 text-sm mb-2">
                      {item.name}
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">{item.businessOwner}</p>
                    <div className="flex items-center justify-between">
                      <span className={`badge text-xs ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-700 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                    {item.targetGoLiveDate && (
                      <p className="text-xs text-gray-500 mt-2">
                        Target: {item.targetGoLiveDate}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Project Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Business Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Target Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {workItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.businessOwner}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={item.priority}
                        onChange={(e) => handlePriorityChange(item.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.targetGoLiveDate || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {workItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">No work items found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkItems;
