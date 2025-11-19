import { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const SharePoint = () => {
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [siteContent, setSiteContent] = useState([]);
  const [graphConfig, setGraphConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingContent, setLoadingContent] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [sitesData, configData] = await Promise.all([
        api.getSharePointSites(),
        api.getGraphConfig(),
      ]);
      setSites(sitesData.value);
      setGraphConfig(configData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSiteClick = async (site) => {
    setSelectedSite(site);
    try {
      setLoadingContent(true);
      const contentData = await api.getSharePointSiteContent(site.id);
      setSiteContent(contentData.value);
    } catch (err) {
      alert('Failed to load site content: ' + err.message);
    } finally {
      setLoadingContent(false);
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    const mb = kb / 1024;
    if (mb >= 1) return `${mb.toFixed(2)} MB`;
    return `${kb.toFixed(2)} KB`;
  };

  if (loading) return <LoadingSpinner message="Loading SharePoint sites..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">SharePoint Migration</h1>
        <p className="text-gray-600 mt-1">
          Mock Microsoft Graph API integration for SharePoint content management
        </p>
      </div>

      {/* Mock Warning Banner */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <div className="flex items-start">
          <span className="text-2xl mr-3">ℹ️</span>
          <div>
            <h3 className="font-semibold text-blue-800">Mock Graph API Integration</h3>
            <p className="text-sm text-blue-700 mt-1">
              This is a demonstration of SharePoint integration using the Microsoft Graph
              API. In production, this would connect to real SharePoint sites using
              authenticated Graph API calls.
            </p>
          </div>
        </div>
      </div>

      {/* Graph Configuration */}
      {graphConfig && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-3">Graph API Configuration</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Tenant ID:</span>
              <span className="ml-2 font-mono text-gray-900">
                {graphConfig.tenantId}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Client ID:</span>
              <span className="ml-2 font-mono text-gray-900">
                {graphConfig.clientId}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Base URL:</span>
              <span className="ml-2 font-mono text-gray-900">
                {graphConfig.baseUrl}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <span className="ml-2 badge badge-pending">Mock</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            {graphConfig.note}
          </p>
        </div>
      )}

      {/* Sites and Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sites List */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">SharePoint Sites</h2>
          <div className="space-y-2">
            {sites.map((site) => (
              <button
                key={site.id}
                onClick={() => handleSiteClick(site)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                  selectedSite?.id === site.id
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start">
                  <span className="text-2xl mr-3">📁</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{site.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{site.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>Created: {new Date(site.createdDateTime).toLocaleDateString()}</span>
                      <span>Modified: {new Date(site.lastModifiedDateTime).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {selectedSite?.id === site.id && (
                    <span className="text-primary-600 ml-2">→</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Site Content */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">
            {selectedSite ? `${selectedSite.name} - Content` : 'Site Content'}
          </h2>

          {!selectedSite && (
            <div className="text-center py-12 text-gray-500">
              <span className="text-4xl mb-4 block">📂</span>
              <p>Select a site to view its content</p>
            </div>
          )}

          {loadingContent && (
            <div className="py-12">
              <LoadingSpinner message="Loading content..." />
            </div>
          )}

          {selectedSite && !loadingContent && (
            <div className="space-y-2">
              {siteContent.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">
                      {item.type === 'folder' ? '📁' : '📄'}
                    </span>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                        <span>
                          {item.type === 'folder'
                            ? `${item.itemCount} items`
                            : formatBytes(item.size)}
                        </span>
                        <span>
                          Modified: {new Date(item.lastModified).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {item.type === 'folder' && (
                      <span className="badge bg-blue-100 text-blue-800">
                        {item.itemCount}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {siteContent.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No content found in this site
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Implementation Notes */}
      <div className="card bg-gray-50">
        <h2 className="text-lg font-semibold mb-3">Implementation Notes</h2>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <strong>Production Implementation:</strong> This mock demonstrates the
            structure for a real SharePoint migration tool. In production, you would:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Install @microsoft/microsoft-graph-client package</li>
            <li>Implement Azure AD authentication (MSAL)</li>
            <li>Configure proper Graph API permissions</li>
            <li>Handle pagination for large datasets</li>
            <li>Implement error handling and retry logic</li>
            <li>Add file upload/download capabilities</li>
            <li>Support batch operations for efficiency</li>
          </ul>
          <p className="mt-3">
            <strong>Environment Variables:</strong> Configure these in your .env file:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>GRAPH_TENANT_ID - Your Azure AD tenant ID</li>
            <li>GRAPH_CLIENT_ID - Your app registration client ID</li>
            <li>GRAPH_CLIENT_SECRET - Your app registration secret</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SharePoint;
