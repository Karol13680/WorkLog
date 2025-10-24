import { useState } from "react";
import "./AccessForm.scss";
import DefaultBtn from "../../btn/default/DefaultBtn.tsx";
import FormInput from "../../inputs/formInput/FormInput.tsx";
import { apiFetch } from "../../../api/apiClient.ts";
import { useAuth } from "../../../context/AuthContext.tsx";

const loginForm = [
  { id: "email", label: "Email", type: "email" },
  { id: "password", label: "Hasło", type: "password" },
];

const LoginForm = () => {
  const { login } = useAuth(); // 👈 pobieramy funkcję logowania z kontekstu
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      setLoading(true);
      const response = await apiFetch("/auth/login", {
        method: "POST",
        body: {
          email: formData.email,
          password: formData.password,
        },
      });

      // 👇 to wywoła logikę z AuthContext (ustawia token, stan i przekierowuje)
      login(response.access_token, response.email);

    } catch (err: any) {
      setMessage(err.message || "Nie udało się zalogować. Sprawdź dane.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      {loginForm.map(({ id, label, type }) => (
        <FormInput
          key={id}
          id={id}
          label={label}
          type={type}
          value={(formData as any)[id]}
          onChange={handleChange}
          required
        />
      ))}

      <DefaultBtn size="large" type="submit" disabled={loading}>
        {loading ? "Logowanie..." : "Zaloguj się"}
      </DefaultBtn>

      {message && <p className="form__message">{message}</p>}
    </form>
  );
};

export default LoginForm;
