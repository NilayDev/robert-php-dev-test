import { FieldError, UseFormRegisterReturn, UseFormSetError, UseFormSetValue } from "react-hook-form";
import InputError from "../../components/common/InputError";
import { IFormInput } from "../../pages/translation/AddTranslationsModal";
import { CustomDropdown } from "../common/CustomDropdown";

interface RenderFieldProps {
  fieldKey: string;
  config: {
    label?: string;
    placeholder?: string;
    required?: string;
    isDropdown?: boolean;
    isFile?: boolean;
    isTextarea?: boolean;
  };
  registerProps: UseFormRegisterReturn;
  error?: FieldError;
  value?: string;
  options?: { id: number; CODE:string; NAME: string }[];
  setError: UseFormSetError<IFormInput>;
  setValue:  UseFormSetValue<IFormInput>;
  isDisabled: boolean
}

const RenderField = ({
  fieldKey,
  config,
  registerProps,
  error,
  value,
  options = [],
  setError,
  setValue,
  isDisabled
}: RenderFieldProps) => {
  // console.log("config:",value?.length,error)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const allowedTypes = [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
  
    if (!file) {
      setError("content", {
        type: "required",
        message: "File is required",
      });
    } else if (!allowedTypes.includes(file.type)) {
      setError("content", {
        type: "required",
        message: "Only Word files are allowed",
      });
    } else {
      setError("content",{});
    }
  };
  return (
    <div className="flex flex-col gap-2 w-full">
      <label htmlFor={fieldKey} className="text-sm font-medium">
        {config.label || fieldKey}
        {config.required && <span className="text-red-500"> *</span>}
      </label>

      {config.isTextarea ? (
  <textarea
    {...registerProps}
    placeholder={config.placeholder || fieldKey}
    className="border p-2 rounded-md w-full min-h-[100px]"
  />
) :config.isDropdown ? (
        // <select
        //   {...registerProps}
        //   className="w-full h-10 px-2 rounded-md text-black/50 border border-black/10 focus:outline-none focus:ring-1 focus:ring-primary"
        //   value={value}
        // >
        //   <option value="">Select an option</option>
        //   {options.map((opt) => (
        //     <option key={opt.id} value={opt.id}>
        //       {opt.NAME?.charAt(0).toUpperCase() + opt.NAME.slice(1)}
        //     </option>
        //   ))}
        // </select>
        <CustomDropdown
      value={value}
      onChange={(id)=>setValue(fieldKey as any,id)}
      options={options}
      placeholder={config.placeholder}
      isDisabled={isDisabled}
    />
      ) : config.isFile ? (
        <>
         <input
        type="file"
        accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        {...registerProps}
        onChange={(e) => {
          registerProps.onChange(e); // call RHF's onChange
          handleFileChange(e); // then validate
        }}
        className="border p-2 rounded-md w-full"
      />
       {/* {fieldKey === "content" && value?.length !== 1 && <InputError error={{message: "Source File is required",type:"required"}} />} */}
       </>
       
      ) : (
        <input
          {...registerProps}
          lang="fr"
          placeholder={config.placeholder || fieldKey}
          className={`border p-2 rounded-md w-full ${isDisabled ? "bg-gray-100 opacity-70 cursor-not-allowed" : ""}`}
          disabled={isDisabled}
          
        />
      )}

      <InputError error={error} />
    </div>
  );
};

export default RenderField;
