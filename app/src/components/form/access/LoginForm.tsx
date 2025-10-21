import "./AccessForm.scss";
import DefaultBtn from "../../btn/default/DefaultBtn.tsx";
import FormInput from "../../inputs/formInput/FormInput.tsx";

const loginForm = [
  { id: "email", label: "Email", type: "email" },
  { id: "password", label: "Hasło", type: "password" },
];

const LoginForm = () => {
  return (
    <form className="form" >
      {loginForm.map(({ id, label, type }) => (
        <FormInput
          key={id}
          id={id}
          label={label}
          type={type}
          required
        />
      ))}
      <DefaultBtn size="large" type="submit" >
        Zaloguj się
      </DefaultBtn>
    </form>
  );
};

export default LoginForm;
