import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BsPlus } from 'react-icons/bs';
import { useAuth } from "@clerk/clerk-react";
import { apiFetch } from '../../api/apiClient';
import { useApi } from '../../api/useApi';

import Header from '../../components/header/Header';
import ContentContainer from '../../components/contentContainer/ContentContainer';
import FormSection from '../../components/form/section/FormSection';
import FormField from '../../components/form/section/FormField';

import './AddTask.scss';



type ActiveTab = 'projects' | 'clients';

interface OptionType {
  value: string;
  label: string;
}

const projectTypes: OptionType[] = [
  { value: 'web', label: 'Strona internetowa' },
  { value: 'mobile', label: 'Aplikacja mobilna' },
  { value: 'design', label: 'Projekt graficzny' },
];

const priorities: OptionType[] = [
  { value: '1', label: 'Niski' },
  { value: '2', label: 'Średni' },
  { value: '3', label: 'Wysoki' },
  { value: '4', label: 'Krytyczny' },
  { value: '5', label: 'Opcjonalny' },
];

const statuses: OptionType[] = [
  { value: '1', label: 'Nadchodzące' },
  { value: '2', label: 'Trwające' },
  { value: '3', label: 'Weryfikacja' },
  { value: '4', label: 'Zakończone' },
];

const ProjectForm: React.FC = () => {
  const { api } = useApi();
  const [formData, setFormData] = useState({
    task: '',
    projectType: '',
    shortDescription: '',
    details: '',
    priority: '',
    status: '',
    startDate: '',
    endDate: '',
    estimatedTime: '',
    rate: '', 
    client: '',
    companyUrl: '',
    companyEmail: '',
    companyPhone: '',
    link1: '',
  });

  const [clients, setClients] = useState<OptionType[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const data = await api("/clients/all-user");
        setClients(data.map((c: any) => ({ value: c.id.toString(), label: c.name })));
      } catch (err) {
        console.error("Błąd połączenia z API:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const data = new FormData();
      data.append('value', formData.rate);
      data.append('short_desc', formData.task);
      data.append('long_desc', formData.details);
      data.append('date_start', formData.startDate);
      data.append('date_stop', formData.endDate);
      data.append('proximity', formData.estimatedTime);
      data.append('id_priority', formData.priority);
      data.append('id_status', formData.status);
      data.append('id_client', formData.client);

      await api('/jobs/add', {
        method: 'POST',
        body: data,
      });

      setMessage('✅ Projekt został dodany pomyślnie!');
      setFormData({
        task: '',
        projectType: '',
        shortDescription: '',
        details: '',
        priority: '',
        status: '',
        startDate: '',
        endDate: '',
        estimatedTime: '',
        rate: '',
        client: '',
        companyUrl: '',
        companyEmail: '',
        companyPhone: '',
        link1: '',
      });
    } catch (error: any) {
      console.error('Błąd:', error);
      setMessage(`❌ Błąd: ${error.message || 'Nie udało się dodać projektu.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="dynamic-form" onSubmit={handleSubmit}>
      <div className="form-grid form-grid--4-cols">
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
            placeholder="Rodzaj..."
            options={projectTypes}
            value={formData.projectType}
            onChange={handleChange}
          />
          <FormField
            label="Skrócony opis"
            name="shortDescription"
            placeholder="Szczegóły projektu..."
            value={formData.shortDescription}
            onChange={handleChange}
          />
          <FormField
            label="Szczegóły zadania"
            name="details"
            type="textarea"
            placeholder="Dodatkowe informacje..."
            rows={6}
            value={formData.details}
            onChange={handleChange}
          />
        </FormSection>

        <FormSection title="Informacje dot. czasu i statusu">
          <FormField
            label="Priorytet"
            name="priority"
            type="select"
            placeholder="Wybierz priorytet"
            options={priorities}
            value={formData.priority}
            onChange={handleChange}
          />
          <FormField
            label="Status"
            name="status"
            type="select"
            placeholder="Wybierz status"
            options={statuses}
            value={formData.status}
            onChange={handleChange}
          />
          <FormField
            label="Data rozpoczęcia"
            name="startDate"
            type="date"
            placeholder="dd.mm.rrrr"
            value={formData.startDate}
            onChange={handleChange}
          />
          <FormField
            label="Data zakończenia"
            name="endDate"
            type="date"
            placeholder="dd.mm.rrrr"
            value={formData.endDate}
            onChange={handleChange}
          />
          <FormField
            label="Szacowany czas (h)"
            name="estimatedTime"
            type="number"
            placeholder="0"
            value={formData.estimatedTime}
            onChange={handleChange}
          />
          <FormField
            label="Stawka (zł/h)"
            name="rate"
            type="number"
            placeholder="np. 120"
            value={formData.rate}
            onChange={handleChange}
          />
        </FormSection>

        <FormSection title="Klient">
          <FormField
            label="Klient"
            name="client"
            type="select"
            placeholder="Wybierz..."
            options={clients}
            value={formData.client}
            onChange={handleChange}
          />
          <FormField
            label="Strona firmy"
            name="companyUrl"
            placeholder="http..."
            value={formData.companyUrl}
            onChange={handleChange}
          />
          <FormField
            label="Email"
            name="companyEmail"
            type="email"
            placeholder="email..."
            value={formData.companyEmail}
            onChange={handleChange}
          />
          <FormField
            label="Telefon"
            name="companyPhone"
            type="tel"
            placeholder="111 111 111"
            value={formData.companyPhone}
            onChange={handleChange}
          />
        </FormSection>

        <FormSection title="Materiały dodatkowe">
          <FormField
            label="Link 1"
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
          {loading ? 'Zapisywanie...' : 'Zapisz'}
        </button>
      </div>

      {message && <p className="form-message">{message}</p>}
    </form>
  );
};

const ClientForm: React.FC = () => {
  const { api } = useApi(); // Używamy Twojego automatu
  const [formData, setFormData] = useState({
    clientName: '',
    clientDescription: '',
    clientPhone: '',
    clientUrl: '',
    clientEmail: '',
    logo: null as File | null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFormData(prev => ({ ...prev, logo: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const data = new FormData();
      data.append('name', formData.clientName);
      data.append('description', formData.clientDescription);
      data.append('email', formData.clientEmail);
      data.append('phone', formData.clientPhone);
      data.append('page', formData.clientUrl);
      data.append('address', '');
      if (formData.logo) data.append('logo', formData.logo);

      // Wywołujemy api - token zostanie dodany automatycznie wewnątrz hooka
      await api('/clients/add', {
        method: 'POST',
        body: data,
      });

      setMessage('✅ Klient został dodany pomyślnie!');
      setFormData({
        clientName: '',
        clientDescription: '',
        clientPhone: '',
        clientUrl: '',
        clientEmail: '',
        logo: null,
      });
    } catch (error: any) {
      console.error('Błąd:', error);
      setMessage(`❌ Błąd: ${error.message || 'Nie udało się dodać klienta.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="dynamic-form" onSubmit={handleSubmit}>
      <div className="form-grid form-grid--3-cols">
        <FormSection title="Informacje ogólne">
          <FormField
            label="Klient"
            name="clientName"
            placeholder="Nazwa klienta..."
            value={formData.clientName}
            onChange={handleChange}
          />
          <FormField
            label="Opis"
            name="clientDescription"
            type="textarea"
            placeholder="Dodatkowe informacje..."
            rows={8}
            value={formData.clientDescription}
            onChange={handleChange}
          />
        </FormSection>

        <FormSection title="Kontakt">
          <FormField
            label="Telefon"
            name="clientPhone"
            placeholder="000 000 000"
            type="tel"
            value={formData.clientPhone}
            onChange={handleChange}
          />
          <FormField
            label="Strona www"
            name="clientUrl"
            placeholder="https://"
            type="url"
            value={formData.clientUrl}
            onChange={handleChange}
          />
          <FormField
            label="E-mail"
            name="clientEmail"
            placeholder="email@firma.pl"
            type="email"
            value={formData.clientEmail}
            onChange={handleChange}
          />
        </FormSection>

        <FormSection title="Logo">
          <FormField
            label="Logo"
            name="logo"
            type="file"
            onChange={handleFileChange as unknown as React.ChangeEventHandler<
              HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
            >}
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
          {loading ? 'Zapisywanie...' : 'Zapisz'}
        </button>
      </div>

      {message && <p className="form-message">{message}</p>}
    </form>
  );
};

const AddTask: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('projects');
  const isProjects = activeTab === 'projects';

  const ActionButton: React.FC = () => (
    <Link to="/add-task" className="action-button">
      {isProjects ? 'Nowy projekt' : 'Nowy klient'} <BsPlus />
    </Link>
  );

  return (
    <>
      <Header />
      <ContentContainer
        title={isProjects ? 'Zarządzanie projektami' : 'Zarządzanie klientami'}
        actionButton={<ActionButton />}
        tabs={
          <>
            <button
              className={`tab-button ${isProjects ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              Projekty
            </button>
            <button
              className={`tab-button ${!isProjects ? 'active' : ''}`}
              onClick={() => setActiveTab('clients')}
            >
              Klienci
            </button>
          </>
        }
        filters={<></>}
      >
        {isProjects ? <ProjectForm /> : <ClientForm />}
      </ContentContainer>
    </>
  );
};

export default AddTask;