import {Link} from "react-router-dom";
import './Access.scss';

import LoginForm from "../../components/form/access/LoginForm.tsx";
import Logo from "../../assets/img/logo.png";
import FormFooter from "../../components/footer/access/FormFooter.tsx";
import AccessImg from "./AccessImg.tsx";

const LogIn = () => {
    return(
        <main className="access-container">
            <section className="access-container__content">
                <Link to="/">
                    <img src={Logo} alt="logo" className="access-container__content--logo"/>
                </Link>
                <LoginForm />
                <FormFooter link="/register" title="Zarejestruj się" />
            </section>
            <AccessImg />
        </main>
    );
}

export default LogIn;