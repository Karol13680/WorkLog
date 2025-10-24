import React from 'react';
import "./FormField.scss"

interface Option {
  value: string | number;
  label: string;
}

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'select' | 'textarea' | 'number' | 'date' | 'tel' | 'url' | 'email';
  placeholder?: string;
  options?: Option[];
  rows?: number;
}

const FormField: React.FC<FormFieldProps> = ({ label, type = 'text', name, placeholder, options, rows }) => {
  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return <textarea name={name} placeholder={placeholder} rows={rows}></textarea>;
      case 'select':
        return (
          <select name={name} defaultValue="">
            <option value="" disabled>{placeholder}</option>
            {options?.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        );
      default:
        return <input type={type} name={name} placeholder={placeholder} />;
    }
  };

  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      {renderInput()}
    </div>
  );
};

export default FormField;