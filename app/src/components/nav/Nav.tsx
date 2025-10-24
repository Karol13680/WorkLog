import { Link, useLocation } from "react-router-dom";
import "./Nav.scss";

const Nav = () => {
  const location = useLocation();

  const navItems = [
    { name: "Zadania", path: "/" },
    { name: "Stoper", path: "/stoper" },
    { name: "Projekty", path: "/projects" },
    { name: "Podsumowanie", path: "/summary" },
  ];

  return (
    <nav className="nav">
      <ul className="nav__list">
        {navItems.map((item, index) => (
          <li
            key={index}
            className={`nav__item ${
              location.pathname === item.path ? "active" : ""
            }`}
          >
            <Link to={item.path} className="nav__link">
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Nav;