import React, { createContext, useReducer, useContext,useEffect } from 'react';
import { authReducer } from './authReducer.js';
import { setupAuthInterceptor } from '../../api/authApi.js';

const AuthContext = createContext();

const initialState = {
    authUser: null,
    token: null,   
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    setupAuthInterceptor(state.token);
  }, [state.token]);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuthContext };
