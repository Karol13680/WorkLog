import React from "react";
import "../Filters.scss";
import { FaSearch, FaChevronDown } from "react-icons/fa";

interface ProjectFiltersProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  selectedClient: string;
  setSelectedClient: React.Dispatch<React.SetStateAction<string>>;
  selectedStatus: string;
  setSelectedStatus: React.Dispatch<React.SetStateAction<string>>;
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedClient,
  setSelectedClient,
  selectedStatus,
  setSelectedStatus,
}) => (
  <>
    <div className="search-bar">
      <FaSearch className="search-bar__icon" />
      <input
        type="text"
        placeholder="Wyszukaj projekt"
        className="search-bar__input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>

    <div className="filter-dropdown">
      <span>Klient</span>
      <FaChevronDown />
    </div>

    <div className="filter-dropdown">
      <span>Status</span>
      <FaChevronDown />
    </div>

    <div className="filter-dropdown">
      <span>Priorytet</span>
      <FaChevronDown />
    </div>

    <div className="filter-dropdown">
      <span>Rodzaj projektu</span>
      <FaChevronDown />
    </div>
  </>
);

export default ProjectFilters;
