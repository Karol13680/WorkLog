import React from 'react';
import './RecentActivities.scss';

const mockActivities = [
  { id: 1, title: 'Rebranding', description: 'Stworzenie nowego logo, mockupu i filmy promocyjne.', date: '9.10.2025 13:25', duration: '2h', amount: '88,00 zł' },
  { id: 2, title: 'Rebranding', description: 'Stworzenie nowego logo...', date: '9.10.2025 13:25', duration: '2h', amount: '88,00 zł' },
  { id: 3, title: 'Rebranding', description: 'Stworzenie nowego logo...', date: '9.10.2025 13:25', duration: '2h', amount: '88,00 zł' },
  { id: 4, title: 'Rebranding', description: 'Stworzenie nowego logo...', date: '9.10.2025 13:25', duration: '2h', amount: '88,00 zł' },
];

const RecentActivities: React.FC = () => {
  return (
    <div className="widget recent-activities">
      <h3 className="widget__title">Ostatnie aktywności</h3>
      <ul className="recent-activities__list">
        {mockActivities.map(activity => (
          <li key={activity.id} className="recent-activities__item">
            <div className="recent-activities__details">
              <h4>{activity.title}</h4>
              <p>{activity.description}</p>
              <span>{activity.date}</span>
            </div>
            <div className="recent-activities__info">
              <span className="duration">{activity.duration}</span>
              <span className="amount">{activity.amount}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivities;