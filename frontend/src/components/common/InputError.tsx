import { FieldError } from "react-hook-form";

const InputError = ({ error }: { error: FieldError | undefined }) => {
  return (
    <>{error && <p className="text-red-600 text-sm">{error.message}</p>}</>
  );
};

export default InputError;
