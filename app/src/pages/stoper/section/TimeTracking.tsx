import React, { useState, useEffect } from 'react';
import { FaPlay, FaStop } from 'react-icons/fa';
import { useApi } from '../../../api/useApi';
import './TimeTracking.scss';

interface TimeTrackingProps {
  selectedProjectId: number | null;
  onStop?: () => void;
}

const TimeTracking: React.FC<TimeTrackingProps> = ({ selectedProjectId, onStop }) => {
  const { api } = useApi();
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [currentLogId, setCurrentLogId] = useState<number | null>(null);

  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => setTime(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const handleStart = async () => {
    try {
      const data = await api("/logs/start", {
        method: "POST",
        body: { id_job: selectedProjectId }
      });
      setCurrentLogId(data.log.id);
      setTime(0);
      setIsActive(true);
    } catch (error) {
      alert("Błąd startu stoperu.");
    }
  };

  const handleStop = async () => {
    try {
      await api(`/logs/stop/${currentLogId}`, {
        method: "PUT"
      });
      setIsActive(false);
      setCurrentLogId(null);
      onStop?.();
    } catch (error) {
      alert("Błąd zatrzymania.");
    }
  };

  return (
    <div className="widget time-tracking">
      <div className="time-tracking__display">
        {Math.floor(time / 3600).toString().padStart(2, '0')}:
        {Math.floor((time % 3600) / 60).toString().padStart(2, '0')}:
        {(time % 60).toString().padStart(2, '0')}
      </div>
      <button 
        className={`time-tracking__button ${isActive ? 'stop' : 'start'}`}
        onClick={isActive ? handleStop : handleStart}
        disabled={!selectedProjectId && !isActive}
      >
        {isActive ? <><FaStop /> Stop</> : <><FaPlay /> Start</>}
      </button>
    </div>
  );
};

export default TimeTracking;