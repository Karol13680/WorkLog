import React from 'react';
import "./FormField.scss";

interface Option {
  value: string | number;
  label: string;
}

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'select' | 'textarea' | 'number' | 'date' | 'tel' | 'url' | 'email' | 'file';
  placeholder?: string;
  options?: Option[];
  rows?: number;
  value?: string | number;
  onChange?: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => void;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  type = 'text',
  name,
  placeholder,
  options,
  rows,
  value,
  onChange,
}) => {
  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            id={name}
            name={name}
            placeholder={placeholder}
            rows={rows}
            value={value as string | undefined}
            onChange={onChange}
          />
        );

      case 'select':
        return (
          <select
            id={name}
            name={name}
            value={value as string | number | undefined}
            onChange={onChange}
          >
            <option value="">{placeholder || 'Wybierz...'}</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'file':
        return (
          <input
            id={name}
            type="file"
            name={name}
            onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
          />
        );

      default:
        return (
          <input
            id={name}
            type={type}
            name={name}
            placeholder={placeholder}
            value={value as string | number | undefined}
            onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
          />
        );
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
