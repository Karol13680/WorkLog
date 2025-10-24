import React, { type ReactNode } from 'react';
import "./FormSection.scss";

interface FormSectionProps {
  title: string;
  children: ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children }) => {
  return (
    <div className="form-section">
      <h3 className="form-section__title">{title}</h3>
      <div className="form-section__content">
        {children}
      </div>
    </div>
  );
};

export default FormSection;