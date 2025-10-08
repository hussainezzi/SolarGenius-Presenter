import React, { useState, useEffect } from 'react';

interface ApiKeyManagerProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ apiKey, onApiKeyChange }) => {
  const [localApiKey, setLocalApiKey] = useState(apiKey);

  useEffect(() => {
    setLocalApiKey(apiKey);
  }, [apiKey]);

  const handleSave = () => {
    onApiKeyChange(localApiKey);
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="api-key-input" className="block text-sm font-medium mb-1">
          Your Gemini API Key
        </label>
        <div className="flex space-x-2">
          <input
            id="api-key-input"
            type="password"
            value={localApiKey}
            onChange={(e) => setLocalApiKey(e.target.value)}
            placeholder="Enter your API key"
            className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ffeb3b] focus:border-transparent"
          />
          <button
            onClick={handleSave}
            className="bg-[#333333] text-white font-bold py-2 px-4 rounded-md hover:bg-opacity-80 transition-colors"
          >
            Save
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Uses environment key as fallback. Your key is stored in your browser.
        </p>
      </div>

      <details className="group">
        <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-black list-none">
          <div className="flex items-center">
            <span className="group-open:hidden transform rotate-90 inline-block mr-1">▶</span>
            <span className="hidden group-open:inline-block mr-1">▼</span>
            How to get an API key?
          </div>
        </summary>
        <div className="mt-2 pl-4 border-l-2 border-gray-300 text-sm text-gray-600 space-y-1">
            <p>1. Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a>.</p>
            <p>2. Sign in with your Google account.</p>
            <p>3. Click on "Create API key".</p>
            <p>4. Copy the generated key and paste it into the field above.</p>
        </div>
      </details>
    </div>
  );
};

export default ApiKeyManager;