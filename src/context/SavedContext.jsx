import React, { createContext, useContext, useState, useEffect } from 'react';

const SavedContext = createContext();

export const useSaved = () => useContext(SavedContext);

export const SavedProvider = ({ children }) => {
  const [savedItems, setSavedItems] = useState(() => {
    const local = localStorage.getItem('edugen_saved');
    return local ? JSON.parse(local) : [];
  });

  useEffect(() => {
    localStorage.setItem('edugen_saved', JSON.stringify(savedItems));
  }, [savedItems]);

  const saveItem = (item) => {
    setSavedItems((prev) => {
      // Prevent duplicates
      if (prev.find(i => i.id === item.id && i.type === item.type)) {
        return prev;
      }
      return [...prev, { ...item, time: 'Saved just now', timestamp: Date.now() }];
    });
  };

  const removeItem = (id, type) => {
    setSavedItems((prev) => prev.filter(item => !(item.id === id && item.type === type)));
  };

  const isSaved = (id, type) => {
    return savedItems.some(item => item.id === id && item.type === type);
  };

  return (
    <SavedContext.Provider value={{ savedItems, saveItem, removeItem, isSaved }}>
      {children}
    </SavedContext.Provider>
  );
};
