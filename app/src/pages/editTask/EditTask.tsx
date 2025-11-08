import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Header from "../../components/header/Header";
import ContentContainer from "../../components/contentContainer/ContentContainer";
import FormSection from "../../components/form/section/FormSection";
import FormField from "../../components/form/section/FormField";

import "./EditTask.scss";

interface OptionType {
  value: string;
  label: string;
}

const projectTypes: OptionType[] = [
  { value: "web", label: "Strona internetowa" },
  { value: "mobile", label: "Aplikacja mobilna" },
  { value: "design", label: "Projekt graficzny" },
];

const priorities: OptionType[] = [
  { value: "1", label: "Niski" },
  { value: "2", label: "Średni" },
  { value: "3", label: "Wysoki" },
  { value: "4", label: "Krytyczny" },
  { value: "5", label: "Opcjonalny" },
];

const statuses: OptionType[] = [
  { value: "1", label: "Nadchodzące" },
  { value: "2", label: "Trwające" },
  { value: "3", label: "Weryfikacja" },
  { value: "4", label: "Zakończone" },
];

const EditTask: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState({
    task: "",
    projectType: "",
    details: "",
    priority: "",
    status: "",
    startDate: "",
    endDate: "",
    estimatedTime: "",
    rate: "",
    link1: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // 🔹 Pobieranie danych projektu z backendu
  useEffect(() => {
    const fetchJob = async () => {
        try {
            console.log("📡 Pobieranie projektu ID:", id);
            setLoading(true);
            const token = localStorage.getItem("access_token");
            if (!token) {
            console.warn("⚠️ Brak tokenu w localStorage!");
            return;
            }

            const res = await fetch(`http://localhost:5000/jobs/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
            });

            console.log("📥 Odpowiedź fetch:", res.status, res.statusText);

            if (!res.ok) throw new Error(await res.text());

            const data = await res.json();
            console.log("📦 Dane pobrane z backendu:", data);

            // 🔹 WAŻNE: dane są w data.job
            const job = data.job || {};
            const links = data.links || [];

            const formatDate = (dateStr?: string) => {
            if (!dateStr) return "";
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return "";
            return date.toISOString().slice(0, 10);
            };

            setFormData({
            task: job.short_desc || "",
            projectType: job.project_type || "web", 
            details: job.long_desc || "",
            priority: job.id_priority?.toString() || "",
            status: job.id_status?.toString() || "",
            startDate: formatDate(job.date_start),
            endDate: formatDate(job.date_stop),
            estimatedTime: job.proximity?.toString() || "",
            rate: job.value?.toString() || "",
            link1: links[0]?.url || "",
            });


            console.log("✅ Ustawione formData:", {
            ...job,
            links,
            });

        } catch (err) {
            console.error("❌ Błąd pobierania projektu:", err);
        } finally {
            setLoading(false);
        }
        };

    fetchJob();
  }, [id]);

  // 🔹 Obsługa zmian inputów
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    console.log(`✏️ Zmieniono pole [${name}] →`, value);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Zapis zmian projektu
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    console.log("📤 Wysyłane dane do API:", formData);

    try {
      const data = new FormData();
      data.append("value", formData.rate);
      data.append("short_desc", formData.task);
      data.append("long_desc", formData.details);
      data.append("date_start", formData.startDate);
      data.append("date_stop", formData.endDate);
      data.append("proximity", formData.estimatedTime);
      data.append("id_priority", formData.priority);
      data.append("id_status", formData.status);
      data.append("project_type", formData.projectType);

      const token = localStorage.getItem("access_token") || "";
      const res = await fetch(`http://localhost:5000/jobs/update/${id}`, {
        method: "PUT",
        body: data,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const result = await res.json();
      console.log("📬 Odpowiedź z API (update):", result);

      if (res.ok) {
        setMessage("✅ Projekt został zaktualizowany pomyślnie!");
      } else {
        setMessage(`❌ Błąd: ${result.message || "Nie udało się zapisać zmian."}`);
      }
    } catch (error) {
      console.error("💥 Błąd podczas zapisu:", error);
      setMessage("Wystąpił błąd sieci lub serwera.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <ContentContainer
        title={`Edycja projektu #${id}`}
        tabs={<></>}
        actionButton={<></>}
        filters={<></>}
      >
        <form className="dynamic-form" onSubmit={handleSubmit}>
          <div className="form-grid form-grid--3-cols">
            <FormSection title="Informacje ogólne">
              <FormField
                label="Nazwa projektu"
                name="task"
                placeholder="Projekt..."
                value={formData.task}
                onChange={handleChange}
              />
              <FormField
                label="Rodzaj projektu"
                name="projectType"
                type="select"
                options={projectTypes}
                value={formData.projectType}
                onChange={handleChange}
              />
              <FormField
                label="Opis"
                name="details"
                type="textarea"
                placeholder="Opis projektu..."
                rows={6}
                value={formData.details}
                onChange={handleChange}
              />
            </FormSection>

            <FormSection title="Status i czas">
              <FormField
                label="Priorytet"
                name="priority"
                type="select"
                options={priorities}
                value={formData.priority}
                onChange={handleChange}
              />
              <FormField
                label="Status"
                name="status"
                type="select"
                options={statuses}
                value={formData.status}
                onChange={handleChange}
              />
              <FormField
                label="Data rozpoczęcia"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
              />
              <FormField
                label="Data zakończenia"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
              />
              <FormField
                label="Szacowany czas (h)"
                name="estimatedTime"
                type="number"
                value={formData.estimatedTime}
                onChange={handleChange}
              />
              <FormField
                label="Stawka (zł/h)"
                name="rate"
                type="number"
                value={formData.rate}
                onChange={handleChange}
              />
            </FormSection>

            <FormSection title="Materiały">
              <FormField
                label="Link"
                name="link1"
                type="url"
                placeholder="http://"
                value={formData.link1}
                onChange={handleChange}
              />
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
            <button type="submit" className="button button--primary" disabled={loading}>
              {loading ? "Zapisywanie..." : "Zapisz zmiany"}
            </button>
          </div>

          {message && <p className="form-message">{message}</p>}
        </form>
      </ContentContainer>
    </>
  );
};

export default EditTask;
