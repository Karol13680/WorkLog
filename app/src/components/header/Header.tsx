import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.scss";
import Nav from "../nav/Nav";
import Logo from "../../assets/img/logo.png";
import UserAvatar from "../../assets/img/logo.png";
import { useAuth } from "../../context/AuthContext.tsx";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { isAuthenticated, logout } = useAuth();

  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

  // zamykanie dropdown po kliknięciu poza nim
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="header__logo-container">
        <Link to="/dashboard"> 
        <img src={Logo} alt="WorkLog Logo" className="header__logo" />
        </Link>
      </div>

      <div className={`header__nav-wrapper ${isMenuOpen ? "is-open" : ""}`}>
        <Nav />
        <div className="header__user-section" ref={dropdownRef}>
          {isAuthenticated && (
            <div className="header__avatar-wrapper">
              <img
                src={UserAvatar}
                alt="User Avatar"
                className="header__avatar"
                onClick={toggleDropdown}
              />

              {isDropdownOpen && (
                <div className="header__dropdown">
                  <button
                    className="header__logout-link"
                    onClick={logout}
                  >
                    Wyloguj
                  </button>
                </div>
              )}
            </div>
          )}
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
