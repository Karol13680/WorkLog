import React, { useState, useEffect } from 'react';
import { FaPlay, FaStop } from 'react-icons/fa';
import './TimeTracking.scss';

const TimeTracking: React.FC = () => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: number | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else if (!isActive && time !== 0) {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time]);

  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((timeInSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="widget time-tracking">
      <h3 className="widget__title">Time Tracking</h3>
      <div className="time-tracking__display">{formatTime(time)}</div>
      <div className="time-tracking__controls">
        <button className="time-tracking__button start" onClick={() => setIsActive(true)}>
          <FaPlay /> Start
        </button>
        <button className="time-tracking__button stop" onClick={() => setIsActive(false)}>
          <FaStop /> Stop & Save
        </button>
      </div>
    </div>
  );
};

export default TimeTracking;