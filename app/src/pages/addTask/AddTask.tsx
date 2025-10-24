import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BsPlus } from 'react-icons/bs';

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

// --- Dane dla formularza projektów ---
const projectTypes: OptionType[] = [
  { value: 'web', label: 'Strona internetowa' },
  { value: 'mobile', label: 'Aplikacja mobilna' },
  { value: 'design', label: 'Projekt graficzny' },
];
const priorities: OptionType[] = [
  { value: 'low', label: 'Niski' },
  { value: 'medium', label: 'Średni' },
  { value: 'high', label: 'Wysoki' },
];
const statuses: OptionType[] = [
  { value: 'new', label: 'Nowe' },
  { value: 'in-progress', label: 'Trwające' },
  { value: 'completed', label: 'Zakończone' },
];
const clients: OptionType[] = [
  { value: 'techcorp', label: 'TechCorp Solutions' },
  { value: 'innovate', label: 'Innovate INC' },
];
const logoOptions: OptionType[] = [
  { value: 'logo1', label: 'Logo Firmy X' },
  { value: 'logo2', label: 'Logo Firmy Y' },
];

// --- Formularze ---
const ProjectForm: React.FC = () => (
  <form className="dynamic-form">
    <div className="form-grid form-grid--4-cols">
      <FormSection title="Informacje ogólne">
        <FormField label="Zadanie" name="task" placeholder="Projekt..." />
        <FormField label="Rodzaj projektu" name="projectType" type="select" placeholder="Rodzaj..." options={projectTypes} />
        <FormField label="Skrócony opis" name="shortDescription" placeholder="Szczegóły projektu..." />
        <FormField label="Szczegóły zadania" name="details" type="textarea" placeholder="Dodatkowe informacje..." rows={6} />
      </FormSection>

      <FormSection title="Informacje dot. czasu">
        <FormField label="Priorytet" name="priority" type="select" placeholder="Średni" options={priorities} />
        <FormField label="Status" name="status" type="select" placeholder="Trwające" options={statuses} />
        <FormField label="Data rozpoczęcia" name="startDate" placeholder="dd.mm.rrrr" type="date" />
        <FormField label="Data zakończenia" name="endDate" placeholder="dd.mm.rrrr" type="date" />
        <FormField label="Szacowany czas" name="estimatedTime" type="number" placeholder="0" />
      </FormSection>

      <FormSection title="Klient">
        <FormField label="Nazwa" name="client" type="select" placeholder="Wybierz..." options={clients} />
        <FormField label="Strona firmy" name="companyUrl" placeholder="http..." />
        <FormField label="Email" name="companyEmail" placeholder="email..." type="email" />
        <FormField label="Telefon" name="companyPhone" placeholder="111 111 111" type="tel" />
      </FormSection>

      <FormSection title="Materiały dodatkowe">
        <FormField label="Link 1" name="link1" placeholder="http://" type="url" />
      </FormSection>
    </div>

    <div className="form-actions">
      <button type="button" className="button button--secondary">Anuluj</button>
      <button type="submit" className="button button--primary">Zapisz</button>
    </div>
  </form>
);

const ClientForm: React.FC = () => (
  <form className="dynamic-form">
    <div className="form-grid form-grid--3-cols">
      <FormSection title="Informacje ogólne">
        <FormField label="Klient" name="clientName" placeholder="Nazwa klienta..." />
        <FormField label="Rodzaj projektu" name="clientProjectType" placeholder="Rodzaj..." />
        <FormField label="Opis" name="clientDescription" type="textarea" placeholder="Dodatkowe informacje..." rows={8} />
      </FormSection>

      <FormSection title="Kontakt">
        <FormField label="Telefon" name="clientPhone" placeholder="000 000 000" type="tel" />
        <FormField label="url" name="clientUrl" placeholder="https" type="url" />
        <FormField label="email" name="clientEmail" placeholder="email" type="email" />
      </FormSection>

      <FormSection title="Logo">
        <FormField label="Nazwa" name="logo" type="select" placeholder="Wybierz..." options={logoOptions} />
      </FormSection>
    </div>

    <div className="form-actions">
      <button type="button" className="button button--secondary">Anuluj</button>
      <button type="submit" className="button button--primary">Zapisz</button>
    </div>
  </form>
);

// --- Główny komponent ---
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
        title={isProjects ? 'Zarządzanie projektami' : 'Zarządzanie zleceniami klientów'}
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
