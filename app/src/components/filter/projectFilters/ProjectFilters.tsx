import "../Filters.scss";
import { FaSearch, FaChevronDown } from 'react-icons/fa';

const Filters = () => (
  <>
    <div className="search-bar">
      <FaSearch className="search-bar__icon" />
      <input type="text" placeholder="Wyszukaj" className="search-bar__input" />
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
    <div className="filter-dropdown">
      <span>Rok</span>
      <FaChevronDown />
    </div>
    <div className="filter-dropdown">
      <span>Miesiąc</span>
      <FaChevronDown />
    </div>
  </>
);

export default Filters;