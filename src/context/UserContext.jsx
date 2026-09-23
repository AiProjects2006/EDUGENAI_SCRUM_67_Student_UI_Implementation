import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    fullName: 'Alex Explorer',
    grade: 'Grade 4',
    email: 'alex.explorer@school.edu',
    password: 'password123',
    phone: '(+1) 234 567 890',
    avatar: 'twemoji:boy'
  });

  const updateUser = (newData) => {
    setUser((prev) => ({ ...prev, ...newData }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
