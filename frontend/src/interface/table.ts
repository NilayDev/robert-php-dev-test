import { IPaginationInfo } from ".";

// Base interface for table data
export interface ITableData {
  [key: string]: string | number | object | ITableData | undefined;
}

// Column interface
export interface ITableColumn<T = ITableData> {
  key: keyof T | "actions";
  header: string;
  render?: (value: string, row?: T) => React.ReactNode;
  className?:String;
  // render?: (value: T[keyof T], row?: T) => React.ReactNode;
}

// Props interface for the Table component
export interface ITableProps<T = ITableData> {
  columns: ITableColumn<T>[];
  data: T[];
  onSort?: (column: keyof T | "actions") => void;
  isLoading?: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
  onPageChange?: (page: IPaginationInfo) => void;
}

// Props interface for the Search component
export interface ISearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Props interface for the Icon component
export interface IIconInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  iconName?: React.ReactNode; // Optional icon component
  classes?: string;
}
