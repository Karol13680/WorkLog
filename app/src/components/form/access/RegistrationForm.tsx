import "./AccessForm.scss";
import DefaultBtn from "../../btn/default/DefaultBtn.tsx"
import FormInput from "../../inputs/formInput/FormInput.tsx";

const regiForm = [
  { id: "email", label: "Email", type: "email" },
  { id: "first_name", label: "Imię", type: "text" },
  { id: "last_name", label: "Nazwisko", type: "text" },
  { id: "password", label: "Hasło", type: "password" },
  { id: "confirm_password", label: "Potwórz Hasło", type: "password" },
];

const RegistrationForm = () => {
  return (
    <div>
      <form className="form">
        {regiForm.map(({ id, label, type }) => (
          <FormInput
            key={id}
            id={id}
            label={label}
            type={type}
            required
          />
        ))}
        <DefaultBtn size="large" type="submit">
          Zarejestruj się
        </DefaultBtn>
      </form>
    </div>
  );
};

export default RegistrationForm;
