import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useApi } from "../../api/useApi"; 

import Header from "../../components/header/Header";
import ContentContainer from "../../components/contentContainer/ContentContainer";
import FormSection from "../../components/form/section/FormSection";
import FormField from "../../components/form/section/FormField";

import "./EditClient.scss";

interface EditClientData {
  name: string;
  description: string;
  email: string;
  phone: string;
  page: string;
  address: string;
  logo: string;
}

const EditClient: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { api } = useApi(); 
  
  const [formData, setFormData] = useState<EditClientData>({
    name: "",
    description: "",
    email: "",
    phone: "",
    page: "",
    address: "",
    logo: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        // Automat sam pobierze token i doda go do nagłówka
        const data = await api(`/clients/${id}`);

        setFormData({
          name: data.client?.name || "",
          description: data.client?.description || "",
          email: data.contact?.email || "",
          phone: data.contact?.phone || "",
          page: data.contact?.page || "",
          address: data.contact?.address || "",
          logo: data.client?.logo || "",
        });

      } catch (err) {
        console.error("❌ Błąd pobierania klienta:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]); // Usunięto getToken z zależności

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (e.target instanceof HTMLInputElement && e.target.type === "file") {
      const file = e.target.files?.[0] || null;
      setLogoFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("page", formData.page);
      data.append("address", formData.address);
      if (logoFile) data.append("logo", logoFile);

      // Wywołanie przez api - obsłuży token i metodę PUT
      await api(`/clients/update/${id}`, {
        method: "PUT",
        body: data,
      });

      setMessage("✅ Klient został zaktualizowany pomyślnie!");
    } catch (error: any) {
      console.error("💥 Błąd podczas zapisu klienta:", error);
      setMessage(`❌ Błąd: ${error.message || "Nie udało się zapisać zmian."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <ContentContainer
        title={`Edycja klienta #${id}`}
        tabs={<></>}
        actionButton={<></>}
        filters={<></>}
      >
        <form className="dynamic-form" onSubmit={handleSubmit}>
          <div className="form-grid form-grid--3-cols">
            <FormSection title="Informacje ogólne">
              <FormField
                label="Nazwa klienta"
                name="name"
                placeholder="Nazwa klienta..."
                value={formData.name}
                onChange={handleChange}
              />
              <FormField
                label="Opis"
                name="description"
                type="textarea"
                placeholder="Dodatkowe informacje..."
                rows={6}
                value={formData.description}
                onChange={handleChange}
              />
            </FormSection>

            <FormSection title="Kontakt">
              <FormField
                label="Email"
                name="email"
                type="email"
                placeholder="email@firma.pl"
                value={formData.email}
                onChange={handleChange}
              />
              <FormField
                label="Telefon"
                name="phone"
                type="tel"
                placeholder="111 111 111"
                value={formData.phone}
                onChange={handleChange}
              />
              <FormField
                label="Strona www"
                name="page"
                type="url"
                placeholder="https://"
                value={formData.page}
                onChange={handleChange}
              />
              <FormField
                label="Adres"
                name="address"
                placeholder="Adres firmy..."
                value={formData.address}
                onChange={handleChange}
              />
            </FormSection>

            <FormSection title="Logo">
              <FormField
                label="Logo"
                name="logo"
                type="file"
                onChange={handleFileChange}
              />
              {formData.logo && <p>Aktualne logo: {formData.logo}</p>}
            </FormSection>
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="button button--secondary"
              onClick={() => window.history.back()}
            >
              Anuluj
            </button>

            <button
              type="submit"
              className="button button--primary"
              disabled={loading}
            >
              {loading ? "Zapisywanie..." : "Zapisz zmiany"}
            </button>

            <button
  type="button"
  className="button button--danger"
  disabled={loading}
  onClick={async () => {
    if (!window.confirm("Czy na pewno chcesz usunąć tego klienta?")) return;

    setLoading(true);
    setMessage(null);

    try {
      await api(`/clients/delete/${id}`, {
        method: "DELETE",
      });

      setMessage("✅ Klient został usunięty pomyślnie!");
      setTimeout(() => window.history.back(), 1500);
    } catch (err: any) {
      console.error(err);
      setMessage(`❌ Błąd: ${err.message || "Nie udało się usunąć klienta."}`);
    } finally {
      setLoading(false);
    }
  }}
>
  Usuń klienta
</button>
          </div>
          {message && <p className="form-message">{message}</p>}
        </form>
      </ContentContainer>
    </>
  );
};

export default EditClient;