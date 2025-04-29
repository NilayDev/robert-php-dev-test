import { IFormInput } from "./AddTranslationsModal";


export const addTranslationsFieldConfigs: Record<keyof IFormInput, {
  type: string;
  required: string;
  label: string;
  isDropdown: boolean;
  isFile?: boolean;
  isTextarea?: boolean;
  placeholder: string;
}> = {
  title: {
    type: "string",
    required: "Title is required",
    label: "Title",
    isDropdown: false,
    placeholder: "Enter title",
  },
  source_language_id: {
    type: "string",
    required: "",
    isDropdown: true, // Indicates this is a dropdown field
    label: "Source language",
    placeholder: "Select a Source language",
  },
  target_language_id: {
    type: "string",
    required: "Target language is required",
    isDropdown: true, // Indicates this is a dropdown field
    label: "Target language",
    placeholder: "Select a Target language",
  },
  content: {
    type: "file", // <-- add file field config
    required: "File is required",
    label: "Upload Source File",
    isDropdown: false,
    isFile:true,
    placeholder: "", // file inputs don't usually need placeholders
  },
  // content : {
  //   type: "string", // <-- add file field config
  //   required: "Source Text is required",
  //   label: "Upload Source Text",
  //   isDropdown: false,
  //   isFile:false,
  //   isTextarea: true,
  //   placeholder: "Source Text", // file inputs don't usually need placeholders
  // },
};


export const editTranslationsFieldConfigs: Record<keyof IFormInput, {
  type: string;
  required: string;
  label: string;
  isDropdown: boolean;
  isFile?: boolean;
  isTextarea?: boolean;
  placeholder: string;
}> = {
  title: {
    type: "string",
    required: "Title is required",
    label: "Title",
    isDropdown: false,
    placeholder: "Enter title",
  },
  source_language_id: {
    type: "string",
    required: "",
    isDropdown: true, // Indicates this is a dropdown field
    label: "Source language",
    placeholder: "Select a Source language",
  },
  target_language_id: {
    type: "string",
    required: "Target language is required",
    isDropdown: true, // Indicates this is a dropdown field
    label: "Target language",
    placeholder: "Select a Target language",
  },
  content : {
    type: "string", // <-- add file field config
    required: "Source Text is required",
    label: "Upload Source Text",
    isDropdown: false,
    isFile:false,
    isTextarea: true,
    placeholder: "Source Text", // file inputs don't usually need placeholders
  },
};
