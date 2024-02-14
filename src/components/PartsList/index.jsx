import React, { useContext, useState, useEffect } from 'react';
import AppContext from '../../AppContext';
import ProductCard from '../ProductCard';
import Search from '../Search';
import './style.scss';
import useFetchProductsByCategory from '../../hooks/useFetchProductsByCategory';
import useUpdatePagetitle from '../../hooks/useUpdatePagetitle';
import {useUpdateLocalBasket} from '../../hooks/useUpdateLocalBasket';
import Pagination from '../Pagination';

const PartsList = () => {
  const { activeStep, changeActiveStep, navItems, activeStepInfo, basketItems, setBasketItems } = useContext(AppContext);
  
  const [maxItems, setMaxItems] = useState(1);

  const [stepName, setStepName] = useState('');
  const [items, setItems] = useState([]);
  const [fetchedData, setFetchedData] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [meta, setMeta] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Steps
  const stepsOrder = navItems;
  const currentIndex = stepsOrder.findIndex(item => item.id === activeStep);

  // Switch Step
  const goToPrevStep = () => {
    if (currentIndex > 0) {
      setItems([]);
      // Übergib die ID des vorherigen Objekts in componentOrder
      changeActiveStep(stepsOrder[currentIndex - 1].id);
    }
  };
  
  // Funktion zum Wechseln zur nächsten Komponente
  const goToNextStep = () => {
    if (currentIndex < stepsOrder.length - 1) {
      setItems([]);
      // Übergib die ID des nächsten Objekts in componentOrder
      changeActiveStep(stepsOrder[currentIndex + 1].id);
    }
  };

  // Default load
  const fetchProductsByCategory = async (category) => {
    if(category) {
      setLoading(true);
      setError(null);
      setItems([]);
      setMeta([]);
  
      let data = await useFetchProductsByCategory(category);
      if(data) {
        setTimeout(() => {
          setFetchedData(data.data);
          setMeta(data.meta);
          setLoading(false);
        }, 300);
      }
    }
  };

  // Funktion zum schrittweisen Hinzufügen der Elemente
  const addItemsGradually = (data, index = 0) => {
    if (index < data.length) {
      setItems(prevItems => {
        // Überprüfen, ob das aktuelle Element bereits hinzugefügt wurde
        if (prevItems.some(item => item.id === data[index].id)) {
          return prevItems;
        }
        return [...prevItems, data[index]];
      });
      setTimeout(() => addItemsGradually(data, index + 1), 100); // 300ms Verzögerung
    }
  };

  useEffect(() => {
    if (fetchedData.length > 0) {
      setItems([]); // Leeren der aktuellen Liste
      addItemsGradually(fetchedData); // Schrittweises Hinzufügen der neuen Elemente
    }
  }, [fetchedData]);


  // Load with search
  const fetchItemsWithSearch = async (searchQuery = null) => {
    if(searchQuery != null) {
      setLoading(true);
      setError(null);
      setItems([]);
      setMeta([]);
  
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/v1/products/?categoryid=${activeStep}&find=${searchQuery}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if(data) {
          setTimeout(() => {
            setFetchedData(data.data);
            setMeta(data.meta);
            setLoading(false);
          }, 300);
        }
      } catch (e) {
        setError(e.message);
      }
    } 
  };

  const saveProduct = async (id) => {
    await useUpdateLocalBasket(id, activeStep, setBasketItems);
  };

  // Update List
  useEffect(() => {
    setItems([]);
    fetchProductsByCategory(activeStep);
  }, [activeStep]);


  // Update List-Header-Infos
  useEffect(() => {
    if(activeStepInfo) {
      if(activeStepInfo.name) {
        setStepName(activeStepInfo.name);
      }
      if(activeStepInfo.max) {
        setMaxItems(activeStepInfo.max);
      }
    }
  }, [activeStepInfo]);

  return (
    <div className="product-list">
      <div className="header">
        <h2 className="headline">{stepName}</h2>
        <div className="meta">
          <span className="total">Found: {meta.total}</span>
        </div>
      </div>
      <div className="filter">
        <Search key={activeStep} onSearch={fetchItemsWithSearch} />
      </div>
      <div className="list">
        {loading && (
          <span className="loader"></span>
        )}
        {error && (
          <div>Error: {error}</div>
        )}
        {!loading && items.length == 0 && (
          <div>No elements found</div>
        )}

        {items.map(item => (
          <ProductCard key={item.id} {...item} handleSave={saveProduct} activeStep={activeStep} />
        ))}
      </div>

      <Pagination currentIndex={currentIndex} lastIndex={stepsOrder.length - 1} goNext={goToNextStep} goPrev={goToPrevStep}/>
    </div>
  );
};

export default PartsList;