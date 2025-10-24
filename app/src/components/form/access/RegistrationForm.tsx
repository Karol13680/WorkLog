import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AccessForm.scss";
import DefaultBtn from "../../btn/default/DefaultBtn.tsx";
import FormInput from "../../inputs/formInput/FormInput.tsx";
import { apiFetch } from "../../../api/apiClient.ts";

const regiForm = [
  { id: "email", label: "Email", type: "email" },
  { id: "first_name", label: "Imię", type: "text" },
  { id: "last_name", label: "Nazwisko", type: "text" },
  { id: "password", label: "Hasło", type: "password" },
  { id: "confirm_password", label: "Potwórz Hasło", type: "password" },
];

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (formData.password !== formData.confirm_password) {
      setMessage("Hasła nie są identyczne.");
      return;
    }

    try {
      setLoading(true);
      const response = await apiFetch("/auth/register", {
        method: "POST",
        body: {
          email: formData.email,
          password: formData.password,
          name: formData.first_name,
          surname: formData.last_name,
        },
      });

      const confirmed = window.confirm(
        response.message ||
          "Rejestracja zakończona pomyślnie! Kliknij OK, aby przejść do logowania."
      );

      if (confirmed) {
        navigate("/");
      }

      setFormData({
        email: "",
        first_name: "",
        last_name: "",
        password: "",
        confirm_password: "",
      });
    } catch (err: any) {
      setMessage(err.message || "Wystąpił błąd podczas rejestracji.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form className="form" onSubmit={handleSubmit}>
        {regiForm.map(({ id, label, type }) => (
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
          {loading ? "Rejestrowanie..." : "Zarejestruj się"}
        </DefaultBtn>
      </form>

      {message && <p className="form__message">{message}</p>}
    </div>
  );
};

export default RegistrationForm;
