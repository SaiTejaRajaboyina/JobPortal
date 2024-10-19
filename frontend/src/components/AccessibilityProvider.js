import React, { createContext, useContext, useState } from 'react';

// Create a context for accessibility settings
const AccessibilityContext = createContext();

// Custom hook to use accessibility context
export const useAccessibility = () => useContext(AccessibilityContext);

export const AccessibilityProvider = ({ children }) => {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [textSize, setTextSize] = useState(16); // Default text size

  const toggleHighContrast = () => {
    setIsHighContrast((prev) => !prev);
  };

  const increaseTextSize = () => {
    setTextSize((prevSize) => (prevSize < 24 ? prevSize + 2 : prevSize));
  };

  const decreaseTextSize = () => {
    setTextSize((prevSize) => (prevSize > 12 ? prevSize - 2 : prevSize));
  };

  return (
    <AccessibilityContext.Provider
      value={{
        isHighContrast,
        toggleHighContrast,
        textSize,
        increaseTextSize,
        decreaseTextSize,
      }}
    >
      <div
        style={{
          backgroundColor: isHighContrast ? '#000' : '#fff',
          color: isHighContrast ? '#fff' : '#000',
          fontSize: `${textSize}px`,
          minHeight: '100vh',
        }}
      >
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
};
