import { Link } from "react-router-dom";
import "./Access.scss";

import { SignUp } from "@clerk/clerk-react";
import Logo from "../../assets/img/logo.png";
import AccessImg from "./AccessImg.tsx";

function Registration() {
  return (
    <main className="access-container">
      <section className="access-container__content">
        <Link to="/">
          <img
            src={Logo}
            alt="logo"
            className="access-container__content--logo"
          />
        </Link>
        <SignUp signInUrl="/" />
      </section>
      <AccessImg />
    </main>
  );
}

export default Registration;