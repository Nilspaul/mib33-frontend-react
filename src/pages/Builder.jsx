import React, { useState, useContext, useEffect, useLayoutEffect } from 'react';
import Sidebar from './../components/Sidebar';
import PartsList from '../components/PartsList';
import Summary from '../components/Summary';
import AppProvider from '../AppProvider';
import AppContext from './../AppContext';
import useUpdatePagetitle from './../hooks/useUpdatePagetitle';

import useFetchCategories from '../hooks/useFetchCategories';
import useFetchCategorie from '../hooks/useFetchCategorie';

const BuilderContent = () => {
  const { navItems, setNavItems, activeStep, setActiveStep, activeStepInfo, setActiveStepInfo } = useContext(AppContext);

  useUpdatePagetitle("Build4Bytes: Configurator");

  useEffect(() => {
    const fetchCategories = async () => {
      let response = await useFetchCategories();
      if(response.data) {
        setNavItems(response.data);
        setActiveStep(response.data[0].id);
        setActiveStepInfo(response.data[0]);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCategorieDetails = async () => {
      let response = await useFetchCategorie(activeStep);
      if(response) {
        setActiveStepInfo(response);
      }
    };

    fetchCategorieDetails();
  }, [activeStep]);


  return (
    <div className="fullpage builder">
      <div className="columns">
        <div className="column-1">
          <Sidebar navItems={navItems} />
        </div>
        <div className="column-2">
          <PartsList />
        </div>
        <div className="column-3">
          <Summary />
        </div>
      </div>
    </div>
  );
};

const Builder = () => {
  return (
    <AppProvider>
      <BuilderContent />
    </AppProvider>
  );
};

export default Builder;