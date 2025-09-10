import React, { createContext, useContext, useState, useEffect } from 'react';
import featureFlagsService from '../lib/featureFlags';

const FeatureFlagsContext = createContext();

export function useFeatureFlags() {
  const context = useContext(FeatureFlagsContext);
  if (!context) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagsProvider');
  }
  return context;
}

export function FeatureFlagsProvider({ children }) {
  const [flags, setFlags] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFlags() {
      try {
        const loadedFlags = await featureFlagsService.loadFlags();
        setFlags(loadedFlags);
      } catch (error) {
        console.error('Failed to load feature flags:', error);
        setFlags(featureFlagsService.getDefaultFlags());
      } finally {
        setLoading(false);
      }
    }

    loadFlags();
  }, []);

  const isEnabled = (flagName) => {
    return featureFlagsService.isEnabled(flagName);
  };

  const value = {
    flags,
    loading,
    isEnabled
  };

  return (
    <FeatureFlagsContext.Provider value={value}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}

export default FeatureFlagsContext;