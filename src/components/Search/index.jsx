import React, { useState, useEffect } from 'react';
import useUpdateEffect from '../../hooks/useUpdateEffect';
import './style.scss';

const Filter = ( { onSearch } ) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [firstInit, setFirstInit] = useState(false);
  const [delayedSearchTerm, setDelayedSearchTerm] = useState();

  // Delay
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (firstInit && searchTerm !== null && searchTerm !== undefined) {
        setDelayedSearchTerm(searchTerm);
      }
    }, 300);
    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  // Triggered Search
  useEffect(() => {
    setFirstInit(true); // Late-Init against prefetch
    onSearch(delayedSearchTerm);
  }, [delayedSearchTerm]);

  const handleInputChange = (event) => {
    if (event) {
      setSearchTerm(event.target.value);
    }
  };

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <div className="search">
      <input
        type="search"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="search..."
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default Filter;