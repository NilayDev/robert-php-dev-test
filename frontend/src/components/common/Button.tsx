import { IButtonProps } from "../../interface";

const Button = ({
  label,
  variant = "primary",
  type = "button",
  iconName,
  iconClass = "",
  classes = "",
  onClick,
  disabled = false,
  iconLeft = false,
  iconRight = false,
  isLoading = false,
}: IButtonProps) => {
  // Define base styles for different variants
  const baseStyles =
    "transition-all flex items-center justify-center gap-3 text-center hover:bg-opacity-95";

  const variantStyles = {
    primary: "bg-primary text-white py-2 px-16 hover:shadow-lg",
    secondary: "bg-white text-secondary hover:bg-gray-200 border-secondary",
    gray: "bg-black/10 text-black hover:bg-black/20",
    outline: "bg-transparent text-secondary border-secondary hover:bg-gray-100",
    custom: "", // For custom button styles, allow full control with `classes` prop
  };

  return (
    <button
      type={type}
      className={`${classes} ${baseStyles} ${variantStyles[variant]} ${
        disabled ? "disabled:pointer-events-none disabled:opacity-50" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {/* Icon (if provided) */}
      {iconLeft && iconName && (
        <span className={`icon ${iconClass}`}>{iconName}</span>
      )}

      {/* Button Label */}
      {label && (
        <span className="flex items-center">
          {" "}
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white relative top-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                />
              </svg>
              {label}
            </>
          ) : (
            label
          )}
        </span>
      )}

      {iconRight && iconName && (
        <span className={`icon ${iconClass}`}>{iconName}</span>
      )}
    </button>
  );
};

export default Button;
