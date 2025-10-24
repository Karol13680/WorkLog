import React from 'react';
import { FaSearch, FaChevronDown } from 'react-icons/fa';
import "../Filters.scss";

const ClientFilters: React.FC = () => (
  <>
    <div className="search-bar">
      <FaSearch className="search-bar__icon" />
      <input type="text" placeholder="Wyszukaj" className="search-bar__input" />
    </div>
    <div className="filter-dropdown">
      <span>Kraj</span>
      <FaChevronDown />
    </div>
    <div className="filter-dropdown">
      <span>Miejscowość</span>
      <FaChevronDown />
    </div>
  </>
);

export default ClientFilters;