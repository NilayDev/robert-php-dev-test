import * as yup from "yup";

export interface IStringFieldConfig {
  type: string;
  required?: string;
  matches?: { regex: RegExp; message: string };
  min?: { value: number; message: string };
  max?: { value: number; message: string };
  url?: { message: string };
  optional?: boolean;
  isDropdown?: boolean;
  nullable?: boolean;
  oneOf?: { ref: string; message: string }; // Added this line for oneOf validation
}

interface IMixedFieldConfig {
  type: "mixed";
  required?: string;
  tests?: { name: string; test: yup.TestFunction; message: string }[];
}

type IFieldConfig = IStringFieldConfig | IMixedFieldConfig;

export interface IFieldConfigs {
  [key: string]: IFieldConfig;
}
export interface IButtonProps {
  label?: string; // Text inside the button
  variant?: "primary" | "secondary" | "gray" | "outline" | "custom"; // Predefined styles
  type?: "button" | "submit" | "reset"; // Button types
  iconName?: React.ReactNode; // Optional icon component
  iconClass?: string; // Classes for the icon
  classes?: string; // Custom classes for the button
  onClick?: () => void; // Event handler
  disabled?: boolean; // Disabled state
  iconLeft?: boolean; // Icon position
  iconRight?: boolean; // Icon position
  isLoading?: boolean;
}

export interface IPaginationInfo {
  total: number;
  page: number;
  limit: number;
}
