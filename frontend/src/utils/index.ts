import * as yup from "yup";

import { IFieldConfigs } from "../interface";

export function clearToken() {
  localStorage.clear();
}

export const getLocalStorageKeys = (key: string) => {
  return localStorage.getItem(key);
};

export const setLocalStorageKeys = (key: string, value: string) => {
  localStorage.setItem(key, value); // Set the value in local storage
};

export const getSessionStorageKeys = (key: string) => {
  return sessionStorage.getItem(key);
};

export const removeSessionStorageKeys = (key: string) => {
  return sessionStorage.removeItem(key);
};

export const setSessionStorageKeys = (key: string, value: string) => {
  sessionStorage.setItem(key, value); // Set the value in local storage
};;

export const generateValidationSchema = (fields: IFieldConfigs) => {
  const schemaFields: Record<string, yup.AnySchema> = Object.keys(
    fields
  ).reduce((schema: Record<string, yup.AnySchema>, field: string) => {
    const config = fields[field];
    let fieldSchema:
      | yup.StringSchema<string | undefined | null>
      | yup.MixedSchema = yup.mixed();

    // Handle 'string' type fields
    if (config.type === "string") {
      fieldSchema = yup.string();

      // Apply validation rules for string fields
      if (config.nullable) {
        fieldSchema = fieldSchema.nullable();
      }
      if (config.required) {
        fieldSchema = fieldSchema.required(config.required);
      }
      if (config.matches) {
        fieldSchema = fieldSchema.matches(
          config.matches.regex,
          config.matches.message
        );
      }
      if (config.min) {
        fieldSchema = fieldSchema.min(config.min.value, config.min.message);
      }
      if (config.max) {
        fieldSchema = fieldSchema.max(config.max.value, config.max.message);
      }
      if (config.url) {
        fieldSchema = fieldSchema.url(config.url.message);
      }
      if (config.oneOf) {
        fieldSchema = fieldSchema.oneOf(
          [yup.ref(config.oneOf.ref), null],
          config.oneOf.message
        );
      }
      if (config.optional) {
        fieldSchema = fieldSchema.optional();
      }

      // Additional validation for dropdown/select fields
      if (config.isDropdown && config.required) {
        fieldSchema = fieldSchema.test(
          "dropdown-required",
          config.required,
          (value) => value !== "Select" // Check if value is not the placeholder
        );
      }
    }

    // Add the field schema to the overall schema object
    schema[field] = fieldSchema;
    return schema;
  }, {});

  return yup.object().shape(schemaFields);
};
