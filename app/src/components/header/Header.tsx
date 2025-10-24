import { Link } from "react-router-dom";
import { useState } from "react";
import "./Header.scss";

import Nav from "../nav/Nav";
import Logo from "../../assets/img/logo.png";
import UserAvatar from "../../assets/img/logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="header__logo-container">
        <Link to="/">
          <img src={Logo} alt="WorkLog Logo" className="header__logo" />
        </Link>
      </div>
      <div className={`header__nav-wrapper ${isMenuOpen ? "is-open" : ""}`}>
        <Nav />
        <div className="header__user-section">
          <button className="header__active-task-btn">Aktywne zadanie</button>
          <img src={UserAvatar} alt="User Avatar" className="header__avatar" />
        </div>
      </div>
      <button
        className={`header__hamburger ${isMenuOpen ? "is-active" : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>
  );
};

export default Header;