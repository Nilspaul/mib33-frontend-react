import React, { useState, useContext } from 'react';
import AppContext from './../AppContext';
import NavItem from './NavItem';

const Sidebar = ({navItems}) => {
  const { activeStep } = useContext(AppContext);

  return (
    <div className="sidebar">
      {navItems.map((item, index) => (
        <NavItem key={item.id} siblings={navItems} label={item.slug} id={item.id} status={activeStep === item.id ? 'active' : ''} />
      ))}
    </div>
  );
};

export default Sidebar;