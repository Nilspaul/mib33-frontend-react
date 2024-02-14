import React, { useState, useContext, useEffect } from 'react';
import AppContext from '../../AppContext';
import './style.scss';
import { getItemsByCategory } from '../../utils/localBasket';

const NavItem = ({ id, siblings, label }) => {
  const { activeStep, changeActiveStep} = useContext(AppContext);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const items = getItemsByCategory(id);
    if(items.length) {
      setStatus('done');
    } else {
      setStatus('');
    }
  }, [activeStep]);

  const handleClick = () => {
    changeActiveStep(id);
  };

  return (
    <div className={`nav-item ${activeStep === id ? 'active' : ''} ${status ? 'status-' + status : ''}`} onClick={handleClick} id={id}>
      <div className="label">{label}</div>
    </div>
  );
};

export default NavItem;