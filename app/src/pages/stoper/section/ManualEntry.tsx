import React, { useState, useEffect } from 'react';
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
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("Brak autoryzacji");

        const response = await fetch("http://localhost:5000/jobs/all-user", {
          headers: { "Authorization": `Bearer ${token}` },
          credentials: "include"
        });

        if (!response.ok) throw new Error("Nie udało się pobrać projektów");
        
        const data: Project[] = await response.json();
        setProjects(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Wystąpił nieznany błąd");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedProjectId || !startTime || !stopTime) {
      setError("Wszystkie pola są wymagane.");
      return;
    }
    if (new Date(stopTime) <= new Date(startTime)) {
      setError("Czas zakończenia musi być późniejszy niż rozpoczęcia.");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://localhost:5000/logs/manual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: "include",
        body: JSON.stringify({
          id_job: parseInt(selectedProjectId),
          start: startTime,
          stop: stopTime
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Błąd serwera");
      }

      alert("Pomyślnie dodano wpis!");
      handleCancel(); 
      onAdded?.(); 
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Wystąpił nieznany błąd");
      }
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
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="start">Rozpoczęcie</label>
          <input 
            type="datetime-local" 
            id="start" 
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="end">Zakończenie</label>
          <input 
            type="datetime-local" 
            id="end" 
            value={stopTime}
            onChange={e => setStopTime(e.target.value)}
          />
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