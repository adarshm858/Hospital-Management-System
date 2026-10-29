import { createContext, useContext, useState, useEffect } from 'react';
import { maskName, maskPhone, maskEmail, maskId } from '../utils/formatters';

const PrivacyContext = createContext(null);

export function PrivacyProvider({ children }) {
  const [isPrivacyMode, setIsPrivacyMode] = useState(() => {
    return localStorage.getItem('hms-privacy-mode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('hms-privacy-mode', isPrivacyMode);
  }, [isPrivacyMode]);

  const togglePrivacyMode = () => {
    setIsPrivacyMode((prev) => !prev);
  };

  /**
   * Helper function to mask a value if privacy mode is active
   */
  const mask = (value, type = 'name') => {
    if (!isPrivacyMode || !value) return value;
    switch (type) {
      case 'name':
        return maskName(value);
      case 'phone':
        return maskPhone(value);
      case 'email':
        return maskEmail(value);
      case 'id':
        return maskId(value);
      default:
        return value;
    }
  };

  return (
    <PrivacyContext.Provider
      value={{
        isPrivacyMode,
        togglePrivacyMode,
        mask
      }}
    >
      {children}
    </PrivacyContext.Provider>
  );
}

export function usePrivacy() {
  const context = useContext(PrivacyContext);
  if (!context) {
    throw new Error('usePrivacy must be used within a PrivacyProvider');
  }
  return context;
}
