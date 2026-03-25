import { Link } from "react-router-dom";
import './Access.scss';

import { SignIn } from "@clerk/clerk-react";
import Logo from "../../assets/img/logo.png";
import AccessImg from "./AccessImg.tsx";

const LogIn = () => {
    return(
        <main className="access-container">
            <section className="access-container__content">
                <Link to="/">
                    <img src={Logo} alt="logo" className="access-container__content--logo"/>
                </Link>
                <SignIn signUpUrl="/register" />
            </section>
            <AccessImg />
        </main>
    );
}

export default LogIn;