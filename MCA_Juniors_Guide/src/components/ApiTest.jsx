import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://padidaw-parama-backend.onrender.com/api';

const ApiTest = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testEndpoints = async () => {
    setLoading(true);
    const endpoints = [
      { name: 'Server Root', url: `${API_BASE_URL}` },
      { name: 'Roadmap Health', url: `${API_BASE_URL}/roadmaps/health` },
      { name: 'Roadmap Test', url: `${API_BASE_URL}/roadmaps/test` },
      { name: 'Get All Roadmaps', url: `${API_BASE_URL}/roadmaps/all` }
    ];

    const testResults = {};
    
    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(endpoint.url);
        testResults[endpoint.name] = {
          status: 'SUCCESS',
          data: response.data,
          statusCode: response.status
        };
      } catch (error) {
        testResults[endpoint.name] = {
          status: 'ERROR',
          error: error.message,
          statusCode: error.response?.status || 'No Response'
        };
      }
    }
    
    setResults(testResults);
    setLoading(false);
  };

  useEffect(() => {
    testEndpoints();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">API Connection Test</h1>
      
      <button 
        onClick={testEndpoints}
        disabled={loading}
        className="mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Testing...' : 'Test API Endpoints'}
      </button>

      <div className="space-y-4">
        {Object.entries(results).map(([name, result]) => (
          <div key={name} className="border rounded p-4">
            <h3 className="font-semibold text-lg">{name}</h3>
            <div className={`text-sm ${result.status === 'SUCCESS' ? 'text-green-600' : 'text-red-600'}`}>
              Status: {result.status} (Code: {result.statusCode})
            </div>
            {result.status === 'SUCCESS' ? (
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            ) : (
              <div className="mt-2 text-red-600 text-sm">
                Error: {result.error}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApiTest;