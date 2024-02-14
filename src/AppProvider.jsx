import React, { useState, useContext, useEffect, useLayoutEffect } from 'react';
import AppContext from './AppContext';
import { useLocalStorage } from './hooks/useStorage';

const AppProvider = ({ children }) => {
  const [activeStep, setActiveStep] = useState('');
  const [loggedInUser, setLoggedInUser] = useLocalStorage('user');
  const [activeStepInfo, setActiveStepInfo] = useState(null);
  const [navItems, setNavItems] = useState([]);
  const [basketItems, setBasketItems] = useLocalStorage('basket');

  // Funktion, um die aktive Komponente zu wechseln
  const changeActiveStep = (component) => {
    setActiveStep(component);
  };

  const props = { 
    activeStep, 
    setActiveStep, 
    changeActiveStep, 
    navItems, 
    setNavItems, 
    activeStepInfo, 
    setActiveStepInfo, 
    loggedInUser, 
    setLoggedInUser,
    basketItems,
    setBasketItems
  };

  return (
    <AppContext.Provider value={props}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;