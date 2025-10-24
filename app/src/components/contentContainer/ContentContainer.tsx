import React from 'react';
import './ContentContainer.scss';

interface ContentContainerProps {
  title: string;
  tabs: React.ReactNode;
  actionButton: React.ReactNode;
  filters: React.ReactNode;
  children: React.ReactNode;
}

const ContentContainer: React.FC<ContentContainerProps> = ({
  title,
  tabs,
  actionButton,
  filters,
  children,
}) => {
  return (
    <div className="content-container">
      <header className="content-container__header">
        <div className="content-container__title-section">
          <h2 className="content-container__title">{title}</h2>
          <div className="content-container__tabs">{tabs}</div>
        </div>
        <div className="content-container__action">{actionButton}</div>
      </header>
      <div className="content-container__filters">{filters}</div>
      <main className="content-container__content">{children}</main>
    </div>
  );
};

export default ContentContainer;