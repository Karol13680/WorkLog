import { Link } from "react-router-dom";
import "./Access.scss";

import RegistrationForm from "../../components/form/access/RegistrationForm.tsx";
import Logo from "../../assets/img/logo.png";
import FormFooter from "../../components/footer/access/FormFooter.tsx";
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
        <RegistrationForm />
        <FormFooter link="/" title="Zaloguj się" />
      </section>
      <AccessImg />
    </main>
  );
}

export default Registration;