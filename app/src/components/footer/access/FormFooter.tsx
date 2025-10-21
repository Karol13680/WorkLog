import { Link } from "react-router-dom";
import "./FormFooter.scss";
import SectionDivider from "../../../assets/svg/SectionDivider.tsx";

type LinkProps = {
  link: string;
  title: string;
};

const FormFooter = ({ title, link }: LinkProps) => {
  return (
    <footer className="form-footer">
      <div className="form-footer__divider">
        <SectionDivider />
      </div>
      <div className="form-footer__links">
        <Link to="#">Pomoc</Link>
        <Link to={link} className="form-footer__links--regi">
          {title}
        </Link>
      </div>
    </footer>
  );
};

export default FormFooter;