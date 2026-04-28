import React, { useState, useEffect } from 'react';
import { useApi } from '../../../api/useApi'; // Import Twojego hooka
import './ManualEntry.scss';

interface Project {
  id: number;
  title: string;
  rate: string; 
}

interface ManualEntryProps {
  onAdded?: () => void;
}

const ManualEntry: React.FC<ManualEntryProps> = ({ onAdded }) => {
  const { api } = useApi(); // Inicjalizacja automatu
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [stopTime, setStopTime] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        // Automat sam ogarnie token
        const data = await api("/jobs/all-user");
        setProjects(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []); // Czysta tablica zależności

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedProjectId || !startTime || !stopTime) {
      setError("Wszystkie pola są wymagane.");
      return;
    }

    try {
      // Wysyłamy POST przez automat api - token doda się sam
      await api("/logs/manual", {
        method: "POST",
        body: {
          id_job: parseInt(selectedProjectId),
          start: startTime,
          stop: stopTime
        }
      });

      alert("Pomyślnie dodano wpis!");
      handleCancel(); 
      onAdded?.(); 
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setSelectedProjectId("");
    setStartTime("");
    setStopTime("");
    setError(null);
  };

  return (
    <div className="widget manual-entry">
      <h3 className="widget__title">Ręczne wprowadzenie</h3>
      <form className="manual-entry__form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="task">Zadanie</label>
          <select 
            id="task" 
            value={selectedProjectId} 
            onChange={e => setSelectedProjectId(e.target.value)}
            disabled={loading}
          >
            <option value="">{loading ? "Ładowanie..." : "Wybierz projekt..."}</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.title}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="start">Rozpoczęcie</label>
          <input type="datetime-local" id="start" value={startTime} onChange={e => setStartTime(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="end">Zakończenie</label>
          <input type="datetime-local" id="end" value={stopTime} onChange={e => setStopTime(e.target.value)} />
        </div>
        {error && <p className="manual-entry__error">{error}</p>}
        <div className="manual-entry__actions">
          <button type="button" className="button--secondary" onClick={handleCancel}>Anuluj</button>
          <button type="submit" className="button--primary">Dodaj</button>
        </div>
      </form>
    </div>
  );
};

export default ManualEntry;