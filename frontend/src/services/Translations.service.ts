import { AxiosRequestConfig } from "axios";

import { get, patch, post, put } from "./ApiClient.service";


export const getTranslationsDataList = async (request?: AxiosRequestConfig) => {
  return get("translations", request, false);
};


export const getLanguagesDataList = async (request?: AxiosRequestConfig) => {
  return get("languages", request, false);
};


export const createTranslations = async (request: AxiosRequestConfig) => {
  return post("translations", request?.data ,  {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }, true);
};

export const updateTranslations = async (id:number,request: AxiosRequestConfig) => {
  return post(
    `translations/${id}`,
    request.data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
    true
  );
};
