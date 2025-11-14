import { AlertCircle, X } from 'lucide-react';
import { useState } from 'react';

const ErrorMessage = ({ message, onClose, className = '' }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
        <div className="ml-3 flex-1">
          <p className="text-sm text-red-800">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={handleClose}
            className="ml-3 text-red-400 hover:text-red-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
