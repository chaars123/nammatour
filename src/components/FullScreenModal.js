import React from 'react';

const FullScreenModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex justify-center items-center overflow-auto">
      <div className="max-w-4xl w-full mx-auto p-6 bg-white rounded-lg shadow-xl">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default FullScreenModal;
