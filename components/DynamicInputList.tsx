import React from 'react';
import { PlusIcon, MinusIcon } from './icons';

interface DynamicInputListProps {
  label: string;
  values: string[];
  onChange: (newValues: string[]) => void;
  placeholder?: string;
}

const DynamicInputList: React.FC<DynamicInputListProps> = ({ label, values, onChange, placeholder }) => {
  const handleValueChange = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = value;
    onChange(newValues);
  };

  const addValue = () => {
    onChange([...values, '']);
  };

  const removeValue = (index: number) => {
    if (values.length > 0) {
      const newValues = values.filter((_, i) => i !== index);
      // if last item is removed, add a blank one
      if (newValues.length === 0) {
        onChange(['']);
      } else {
        onChange(newValues);
      }
    }
  };
  
  const inputStyle = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-gray-900 dark:text-gray-100";
  const labelStyle = "block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div>
      <label className={labelStyle}>{label}</label>
      {values.map((value, index) => (
        <div key={index} className="flex items-center space-x-2 mt-2">
          <input
            type="text"
            value={value}
            onChange={(e) => handleValueChange(index, e.target.value)}
            className={inputStyle}
            placeholder={placeholder}
          />
          <button
            type="button"
            onClick={addValue}
            className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            aria-label="Add field"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
          
          <button
            type="button"
            onClick={() => removeValue(index)}
            className="p-2 bg-danger text-white rounded-md hover:bg-danger-dark"
            aria-label="Remove field"
          >
            <MinusIcon className="h-4 w-4" />
          </button>
          
        </div>
      ))}
    </div>
  );
};

export default DynamicInputList;
