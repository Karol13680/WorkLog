import React, { useState, useEffect } from 'react';
import { useAuth } from "@clerk/clerk-react";
import { apiFetch } from '../../../api/apiClient';
import './RecentActivities.scss';

interface BackendLog {
  id: number;
  id_job: number;
  start: string; 
  stop: string | null; 
}

interface Project {
  id: number;
  title: string;
  description: string;
  rate: string; 
}

interface Activity {
  id: number;
  title: string;
  description: string;
  date: string;
  duration: string;
  amount: string;
}

const RecentActivities: React.FC = () => {
  const { getToken } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const formatDuration = (ms: number): string => {
    const mins = Math.floor(ms / 60000);
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('pl-PL', {
      day: 'numeric', month: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        if (!token) return;

        const headers = { "Authorization": `Bearer ${token}` };

        // Pobieramy logi i projekty równolegle
        const [logsRes, projectsData]: [any, Project[]] = await Promise.all([
          apiFetch("/logs/all", { headers }),
          apiFetch("/jobs/all-user", { headers })
        ]);

        // Tworzymy mapę projektów z kluczem jako NUMBER
        const projectsMap = new Map<number, Project>(
          projectsData.map((p) => [Number(p.id), p])
        );

        const logsArray = Array.isArray(logsRes) ? logsRes : (logsRes.logs || []);

        const processed: Activity[] = logsArray
          .filter((log: BackendLog) => log.stop !== null) 
          .sort((a, b) => new Date(b.stop!).getTime() - new Date(a.stop!).getTime()) 
          .slice(0, 10) 
          .map((log: BackendLog) => {
            const project = projectsMap.get(Number(log.id_job));
            
            const rateStr = project?.rate || "0";
            const rateValue = parseFloat(rateStr.replace(/[^\d.]/g, '')) || 0;
            
            const diff = new Date(log.stop!).getTime() - new Date(log.start).getTime();
            const amount = (diff / 3600000) * rateValue;

            return {
              id: log.id,
              title: project?.title || "Nieznany projekt",
              description: project?.description || "Brak opisu",
              date: formatDate(log.stop!),
              duration: formatDuration(diff),
              amount: `${amount.toFixed(2)} zł`
            };
          });

        setActivities(processed);
      } catch (error) {
        console.error("Błąd RecentActivities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [getToken]);

  return (
    <div className="widget recent-activities">
      <h3 className="widget__title">Ostatnie aktywności</h3>
      {loading ? <p>Ładowanie...</p> : activities.length === 0 ? (
        <p className="empty-text">Brak zarejestrowanych aktywności.</p>
      ) : (
        <ul className="recent-activities__list">
          {activities.map(activity => (
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
      )}
    </div>
  );
};

export default RecentActivities;