import React, { useState, useEffect } from 'react';
import { FaPlay, FaStop } from 'react-icons/fa';
import './TimeTracking.scss';

interface TimeTrackingProps {
  selectedProjectId: number | null;
}

const TimeTracking: React.FC<TimeTrackingProps> = ({ selectedProjectId }) => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [currentLogId, setCurrentLogId] = useState<number | null>(null);

  useEffect(() => {
    let interval: number | undefined = undefined;

    if (isActive) {
      interval = window.setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } 
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive]);

  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((timeInSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const handleStart = async () => {
    if (!selectedProjectId) {
      alert("Wybierz projekt, aby rozpocząć mierzenie czasu.");
      return;
    }

    try {
      // --- POPRAWKA TUTAJ ---
      const token = localStorage.getItem("access_token"); 
      
      const response = await fetch("/logs/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        // --- DODANE, ABY PASOWAŁO DO ProjectManagement.tsx ---
        credentials: "include",
        body: JSON.stringify({ id_job: selectedProjectId })
      });

      if (!response.ok) {
        throw new Error("Nie udało się uruchomić logu.");
      }

      const data = await response.json();
      
      setCurrentLogId(data.log.id);
      setTime(0); 
      setIsActive(true);

    } catch (error) {
      console.error("Błąd podczas startu:", error);
      alert("Wystąpił błąd podczas uruchamiania stopera.");
    }
  };

  const handleStop = async () => {
    if (!currentLogId) return; 

    try {
      // --- POPRAWKA TUTAJ ---
      const token = localStorage.getItem("access_token");
      
      const response = await fetch(`/logs/stop/${currentLogId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        // --- DODANE, ABY PASOWAŁO DO ProjectManagement.tsx ---
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error("Nie udało się zatrzymać logu.");
      }

      setIsActive(false);
      setCurrentLogId(null);
      
      alert(`Zapisano log. Czas pracy: ${formatTime(time)}`);
      setTime(0); 

    } catch (error) {
      console.error("Błąd podczas stopu:", error);
      alert("Wystąpił błąd podczas zatrzymywania stopera.");
    }
  };

  return (
    <div className="widget time-tracking">
      <h3 className="widget__title">Time Tracking</h3>
      <div className="time-tracking__display">{formatTime(time)}</div>
      <div className="time-tracking__controls">
        
        {!isActive ? (
          <button 
            className="time-tracking__button start" 
            onClick={handleStart}
            disabled={!selectedProjectId} 
          >
            <FaPlay /> Start
          </button>
        ) : (
          <button 
            className="time-tracking__button stop" 
            onClick={handleStop}
          >
            <FaStop /> Stop & Save
          </button>
        )}
      </div>
      {!selectedProjectId && !isActive && (
        <p className="time-tracking__hint">Wybierz projekt, aby aktywować stoper.</p>
      )}
    </div>
  );
};

export default TimeTracking;