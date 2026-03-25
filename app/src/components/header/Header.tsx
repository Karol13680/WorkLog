import { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.scss";
import Nav from "../nav/Nav";
import Logo from "../../assets/img/logo.png";
import { UserButton, SignedIn } from "@clerk/clerk-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  return (
    <header className="header">
      <div className="header__logo-container">
        <Link to="/dashboard"> 
          <img src={Logo} alt="WorkLog Logo" className="header__logo" />
        </Link>
      </div>

      <div className={`header__nav-wrapper ${isMenuOpen ? "is-open" : ""}`}>
        <Nav />
        <div className="header__user-section">
          <SignedIn>
            <div className="header__avatar-wrapper">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
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