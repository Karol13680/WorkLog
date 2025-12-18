import React, { useState, useEffect } from 'react';
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
  status: string;
  client: string;
  description: string;
  email: string;
  phone: string;
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
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const formatDuration = (durationMs: number): string => {
    const totalMinutes = Math.floor(durationMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('pl-PL', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error("Brak autoryzacji");
        }

        const headers = {
          "Authorization": `Bearer ${token}`
        };

        const [logsResponse, projectsResponse] = await Promise.all([
          fetch("/logs/all", { headers, credentials: "include" }),
          fetch("/jobs/all-user", { headers, credentials: "include" })
        ]);

        if (!logsResponse.ok || !projectsResponse.ok) {
          throw new Error("Nie udało się pobrać danych");
        }

        const logsData: { logs: BackendLog[] } = await logsResponse.json();
        const projectsData: Project[] = await projectsResponse.json();

        const projectsMap = new Map<number, Project>();
        projectsData.forEach(project => {
          projectsMap.set(project.id, project);
        });

        const processedActivities: Activity[] = logsData.logs
          .filter(log => log.stop != null) 
          .sort((a, b) => new Date(b.stop!).getTime() - new Date(a.stop!).getTime()) 
          .slice(0, 10) 
          .map(log => {
            const project = projectsMap.get(log.id_job);
            const title = project ? project.title : "Nieznany projekt";
            const description = project ? project.description : "Brak opisu";
            
            const rateValue = project ? parseFloat(project.rate.split(' ')[0]) : 0;
            
            const startTime = new Date(log.start);
            const stopTime = new Date(log.stop!);
            const durationMs = stopTime.getTime() - startTime.getTime();
            const durationHours = durationMs / (1000 * 60 * 60);
            const amount = durationHours * rateValue;

            return {
              id: log.id,
              title: title,
              description: description,
              date: formatDate(log.stop!),
              duration: formatDuration(durationMs),
              amount: `${amount.toFixed(2)} zł`
            };
          });

        setActivities(processedActivities);
      } catch (error) {
        console.error("Błąd pobierania aktywności:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="widget recent-activities">
      <h3 className="widget__title">Ostatnie aktywności</h3>
      
      {loading && <p>Ładowanie...</p>}
      
      {!loading && activities.length === 0 && (
        <p>Brak zarejestrowanych aktywności.</p>
      )}

      {!loading && activities.length > 0 && (
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