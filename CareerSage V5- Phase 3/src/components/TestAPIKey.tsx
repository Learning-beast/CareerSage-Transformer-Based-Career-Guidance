import React from 'react';

const TestAPIKey = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto mt-8">
      <h2 className="text-lg font-semibold mb-4">API Key Status</h2>
      <div className="space-y-2">
        <div>
          <span className="font-medium">Key Loaded:</span> 
          <span className="ml-2 px-2 py-1 rounded bg-gray-100 text-sm">
            {apiKey ? '✅ Yes' : '❌ No'}
          </span>
        </div>
        <div className="text-xs text-gray-600 mt-4">
          <p className="font-medium mb-1">Note:</p>
          <p>This is a test component to verify API key loading.</p>
          <p>Remove this component in production.</p>
        </div>
      </div>
    </div>
  );
};

export default TestAPIKey;
