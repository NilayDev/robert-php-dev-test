import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from "react-toastify";

import { axiosClient } from "../configs/api.config";
import { clearToken, getLocalStorageKeys } from "../utils";

interface IExtendedAxiosRequestConfig extends AxiosRequestConfig {
  isMultipart?: boolean;
}

interface IExtendedAxiosResponse extends AxiosResponse {
  detail?: string;
  message?: string;
  status_code?: number;
}

interface IExtendedAxiosError extends AxiosError {
  detail: string;
  status?: number;
  status_code?: number;
}

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Check the success.
 *
 */
const checkSuccess = (response: IExtendedAxiosResponse) => {
  // if (response?.detail && (response?.status === 200 || response?.status === 201)) {
  //   toast.success(response?.detail, { autoClose: 2000 });
  // } else if (response?.data?.message && (response?.status === 200 || response?.status === 201)) {
  //   toast.success(response?.data?.message, { autoClose: 2000 });
  // } else {
  //   toast.success("Success!!", { autoClose: 2000 });
  // }
  if (
    response?.data.message &&
    (response?.data?.status_code === 200 || response?.data?.status_code === 201)
  ) {
    toast.success(response?.data.message, { autoClose: 2000 });
  } else {
    toast.success("Success!!", { autoClose: 2000 });
  }
};

/**
 * Check the errors.
 *
 */
const navigateToSignIn = () => {
  clearToken();
  // Use window.location for global navigation outside of components
  window.location.href = "/sign-in";
};

const checkError = (error: IExtendedAxiosError) => {
  if (error?.response && error.response?.data) {
    const { data }: AxiosResponse = error.response;
    console.log("dataL:",data)
    if (data?.detail || data?.message || data?.data?.errors) {
      if (
        data?.status_code !== 401 
      ) {
        console.log("new data error:",data?.data?.errors)
        toast.error(data?.data?.errors, {
          autoClose: 2000,
        });
      }
    } else {
      toast.error("Internal server error", {
        autoClose: 2000,
      });
    }
  } else if (error?.detail === "Network Error") {
    // clearToken();
    toast.error(error?.detail, {
      autoClose: 2000,
    });
  } else if (error?.message) {
    toast.error(error?.message, {
      autoClose: 2000,
    });
  } else {
    toast.error(error?.detail, {
      autoClose: 2000,
    });
  }
  if (error.response) {
    if (error.response.status === 401) {
      clearToken();
      navigateToSignIn();
      //change route to "/sign-in"
    } else if (error.response.status === 403) {
      clearToken();
      navigateToSignIn();
      //change route to "/sign-in"
    }
  }
};

/**
 * Gets the headers.
 *
 */
const getHeaders = (
  data?: IExtendedAxiosRequestConfig,
  isDeleteMethod?: boolean
) => {
  const axiosConfig: AxiosRequestConfig = {
    headers: { "ngrok-skip-browser-warning": "69420" },
  };
  const userToken = data?.data?.isRefreshTokenNeeded
    ? getLocalStorageKeys("refreshtoken")
    : getLocalStorageKeys("token");
  if (axiosConfig.headers) {
    axiosConfig.headers["accept-language"] = "en";
    axiosConfig.headers["Content-Type"] = "application/json";
  }

  if (data) {
    if (data.headers) {
      for (const key in data.headers) {
        if (
          Object.prototype.hasOwnProperty.call(data.headers, key) &&
          axiosConfig.headers
        ) {
          axiosConfig.headers[key] = data.headers[key];
        }
      }
    }

    if (data.params) {
      axiosConfig.params = { ...data.params };
    }
    if (data.data && isDeleteMethod) {
      axiosConfig.data = { ...data.data };
    }
  }
  if (axiosConfig.headers) {
    if (userToken) {
      axiosConfig.headers["authorization"] = `Bearer ${userToken}`;
    } else {
      axiosConfig.headers["authorization"] = ``;
    }
  }

  return axiosConfig;
};

export const get = async (
  path: string,
  config?: AxiosRequestConfig,
  showToast?: boolean
) => {
  return await axiosClient
    .get(`${path}`, getHeaders(config))
    .then((response) => {
      if (showToast) {
        checkSuccess(response);
      }

      return response.data;
    })
    .catch((error) => {
      checkError(error);
      throw error.response.data;
    });
};

export const post = async <T>(
  path: string,
  payload: T,
  config?: AxiosRequestConfig,
  showToast?: boolean
) => {
  return await axiosClient
    .post(`${path}`, payload, getHeaders(config))
    .then((response) => {
      if (showToast) {
        checkSuccess(response);
      }
      if (response?.data?.data?.user?.accessToken) {
        localStorage.setItem("token", response?.data?.data?.user?.accessToken);
        localStorage.setItem(
          "refreshToken",
          response?.data?.data?.user?.refreshToken
        );
        localStorage.setItem("userId", response?.data?.data?.user?.id);
      }
      return response.data;
    })
    .catch((error) => {
      checkError(error);
      throw error.response.data;
    });
};

export const put = async <T>(
  path: string,
  payload: T,
  config?: AxiosRequestConfig,
  showToast?: boolean
) => {
  return await axiosClient
    .put(`${path}`, payload, getHeaders(config))
    .then((response) => {
      if (showToast) {
        checkSuccess(response);
      }
      return response.data;
    })
    .catch((error) => {
      checkError(error);
      throw error.response.data;
    });
};

export const patch = async <T>(
  path: string,
  payload: T,
  config?: AxiosRequestConfig,
  showToast?: boolean
) => {
  return await axiosClient
    .patch(`${path}`, payload, getHeaders(config))
    .then((response) => {
      if (showToast) {
        checkSuccess(response);
      }
      return response?.data;
    })
    .catch((error) => {
      checkError(error);
      throw error?.response?.data;
    });
};

export const deleteMethod = async (
  path: string,
  config?: AxiosRequestConfig,
  showToast?: boolean
) => {
  return await axiosClient
    .delete(`${path}`, getHeaders(config, true))
    .then((response) => {
      if (showToast) {
        checkSuccess(response);
      }
      return response.data;
    })
    .catch((error) => {
      checkError(error);
      throw error.response.data;
    });
};
