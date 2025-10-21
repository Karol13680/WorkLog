import "./FormInput.scss";

type FormInputProps = {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  value?: string;
  disabled?: boolean; 
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const FormInput = ({
  id,
  label,
  type,
  required = false,
  value,
  disabled = false,
  onChange,
}: FormInputProps) => {
  return (
    <label htmlFor={id} className="form-label">
      {label}
      <input
        id={id}
        type={type}
        className="form-label__input"
        required={required}
        value={value} 
        onChange={onChange}
        disabled={disabled} 
      />
    </label>
  );
};

export default FormInput;
