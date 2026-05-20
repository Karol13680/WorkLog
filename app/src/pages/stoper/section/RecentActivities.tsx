import React, { useState, useEffect } from 'react';
import { useApi } from '../../../api/useApi';
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
  rawStart: string;
  rawStop: string;
}

const RecentActivities: React.FC = () => {
  const { api } = useApi();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ start: '', stop: '' });

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

  const toDatetimeLocal = (dateString: string) => {
    const date = new Date(dateString);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const [logsRes, projectsData]: [any, Project[]] = await Promise.all([
        api("/logs/all"),
        api("/jobs/all-user")
      ]);

      const projectsMap = new Map<number, Project>(
        projectsData.map((p) => [Number(p.id), p])
      );

      const logsArray = Array.isArray(logsRes) ? logsRes : (logsRes.logs || []);

      const processed: Activity[] = logsArray
        .filter((log: BackendLog) => log.stop !== null)
        .sort((a: BackendLog, b: BackendLog) => new Date(b.stop!).getTime() - new Date(a.stop!).getTime())
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
            amount: `${amount.toFixed(2)} zł`,
            rawStart: log.start,
            rawStop: log.stop!
          };
        });

      setActivities(processed);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Czy na pewno chcesz usunąć tę aktywność?')) return;
    try {
      await api(`/logs/${id}`, { method: 'DELETE' });
      setActivities(prev => prev.filter(act => act.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (activity: Activity) => {
    setEditingId(activity.id);
    setEditForm({
      start: toDatetimeLocal(activity.rawStart),
      stop: toDatetimeLocal(activity.rawStop)
    });
  };

  const handleSave = async (id: number) => {
  try {
    await api(`/logs/${id}`, {
      method: 'PUT',
      body: {
        start: new Date(editForm.start).toISOString(),
        stop: new Date(editForm.stop).toISOString()
      }
    });
    setEditingId(null);
    fetchActivities();
  } catch (error) {
    console.error(error);
  }
};

  const handleCancel = () => {
    setEditingId(null);
  };

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
                {editingId === activity.id ? (
                  <div className="edit-form">
                    <input
                      type="datetime-local"
                      value={editForm.start}
                      onChange={(e) => setEditForm({...editForm, start: e.target.value})}
                    />
                    <input
                      type="datetime-local"
                      value={editForm.stop}
                      onChange={(e) => setEditForm({...editForm, stop: e.target.value})}
                    />
                  </div>
                ) : (
                  <span className="activity-date">{activity.date}</span>
                )}
              </div>
              <div className="recent-activities__info">
                {editingId === activity.id ? (
                  <div className="action-buttons">
                    <button className="btn-save" onClick={() => handleSave(activity.id)}>Zapisz</button>
                    <button className="btn-cancel" onClick={handleCancel}>Anuluj</button>
                  </div>
                ) : (
                  <>
                    <span className="duration">{activity.duration}</span>
                    <span className="amount">{activity.amount}</span>
                    <div className="action-buttons">
                      <button className="btn-edit" onClick={() => handleEditClick(activity)}>Edytuj</button>
                      <button className="btn-delete" onClick={() => handleDelete(activity.id)}>Usuń</button>
                    </div>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentActivities;
