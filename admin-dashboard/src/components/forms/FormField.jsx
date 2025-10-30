import React from 'react';

const FormField = ({ 
  label, 
  name, 
  type = 'text', 
  register, 
  error, 
  placeholder, 
  required = false,
  options = [],
  className = '',
  helpText,
  ...restProps 
}) => {
  const renderField = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...register(name, { required: required && `${label} is required` })}
            placeholder={placeholder}
            className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            rows={4}
            {...restProps}
          />
        );
      
      case 'select':
        return (
          <select
            {...register(name, { required: required && `${label} is required` })}
            className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            {...restProps}
          >
            <option value="">Select {label}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register(name)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              {...restProps}
            />
            <label className="ml-2 text-sm text-gray-700">{label}</label>
          </div>
        );
      
      case 'radio':
        return (
          <div className="space-y-2">
            {options.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  {...register(name, { required: required && `${label} is required` })}
                  value={option.value}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  {...restProps}
                />
                <label className="ml-2 text-sm text-gray-700">{option.label}</label>
              </div>
            ))}
          </div>
        );
      
      default:
        return (
          <input
            type={type}
            {...register(name, { required: required && `${label} is required` })}
            placeholder={placeholder}
            className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            {...restProps}
          />
        );
    }
  };

  if (type === 'checkbox') {
    return (
      <div className="mb-4">
        {renderField()}
        {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderField()}
      {helpText && <p className="text-xs text-gray-500 mt-1">{helpText}</p>}
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default FormField; 