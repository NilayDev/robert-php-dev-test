import React from "react";

import AllImages from "../../constants/image";

interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
}

const Modal = ({ isOpen, onClose, children, width }: IModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal Content */}
      <div className={`max-h-[80vh] overflow-y-auto relative bg-white rounded-lg p-6 shadow-lg w-full ${width ? width : 'max-w-lg'}`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <AllImages.close />
        </button>

        {/* Content */}
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
