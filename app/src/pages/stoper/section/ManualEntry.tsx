import React from 'react';
import './ManualEntry.scss';

const ManualEntry: React.FC = () => {
  return (
    <div className="widget manual-entry">
      <h3 className="widget__title">Ręczne wprowadzenie</h3>
      <form className="manual-entry__form">
        <div className="form-group">
          <label htmlFor="task">Zadanie</label>
          <input type="text" id="task" placeholder="Projekt..." />
        </div>
        <div className="form-group">
          <label htmlFor="start">Rozpoczęcie</label>
          <input type="text" id="start" placeholder="Projekt..." />
        </div>
        <div className="form-group">
          <label htmlFor="end">Zakończenie</label>
          <input type="text" id="end" placeholder="Projekt..." />
        </div>
        <div className="manual-entry__actions">
          <button type="button" className="button--secondary">Anuluj</button>
          <button type="submit" className="button--primary">Dodaj</button>
        </div>
      </form>
    </div>
  );
};

export default ManualEntry;