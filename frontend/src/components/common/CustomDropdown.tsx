import { useState } from "react";

interface Option {
  id: number;
  CODE: string;
  NAME: string;
}

interface CustomDropdownProps {
  value?: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  isDisabled: boolean
}

export  const CustomDropdown = ({ value, onChange, options, placeholder,isDisabled }: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find((opt) => opt.id.toString() == value);

  return (
    console.log("isDisabled:",isDisabled),
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => !isDisabled && setIsOpen((prev) => !prev)}
        className={`text-gray w-full h-10 px-2 text-left border rounded-md bg-white ${isDisabled ? "bg-gray-100 opacity-70 cursor-not-allowed" : ""}`}
      >
        {selected?.NAME || placeholder || "Select an option"}
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md max-h-40 overflow-y-auto shadow-lg">
          {options.map((opt) => (
            <div
              key={opt.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onChange(opt.id.toString());
                setIsOpen(false);
              }}
            >
              {opt.NAME?.charAt(0).toUpperCase() + opt.NAME.slice(1)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
