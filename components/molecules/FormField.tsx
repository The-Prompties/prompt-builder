// components/molecules/FormField.tsx
import * as React from 'react';
import { Input } from '../atoms/Input';

interface FormFieldProps {
    label: string;
    name: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ label, name, type = 'text', value, onChange, error }) => {
    return (
        <div className="mb-4">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <Input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                className="w-full"
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};