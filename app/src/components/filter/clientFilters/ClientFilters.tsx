import React from "react";
import { FaSearch, FaChevronDown } from "react-icons/fa";
import "../Filters.scss";

interface ClientFiltersProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const ClientFilters: React.FC<ClientFiltersProps> = ({
  searchTerm,
  setSearchTerm,
}) => (
  <>
    <div className="search-bar">
      <FaSearch className="search-bar__icon" />
      <input
        type="text"
        placeholder="Wyszukaj klienta"
        className="search-bar__input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
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
