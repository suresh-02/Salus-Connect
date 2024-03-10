export interface Error {
  name: string;
  isError?: boolean;
  message?: string;
  label: string;
  required?: boolean;
  check?: boolean;
}
