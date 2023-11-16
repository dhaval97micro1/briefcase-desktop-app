import axios, { AxiosError, AxiosResponse } from "axios";
import { getToken, removeToken } from "../storage";

// const DEV_URL =
//   'https://r6k1vdua19.execute-api.eu-north-1.amazonaws.com/dev/api';
const API_URL ="https://r6k1vdua19.execute-api.eu-north-1.amazonaws.com/dev/api";
 //const API_URL = "http://localhost:3000/dev/api";

const onResponse = (response: AxiosResponse): AxiosResponse => {
  // console.info(`[response] [${JSON.stringify(response)}]`);
  return response;
};

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
  if (error.response?.status === 401) {
    removeToken();
    // showError('Session expired. Please login again.');
  }
  return Promise.reject(error);
};

const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use(
  async (config: any) => {
    const token = await getToken();
    if (token) {
      config.headers["Authorization"] = "bearer " + token;
    } else {
      /** After registration, the token is stored in profile_token.
       * Making it separate than the actual token so that routing can be managed based on token
       * */
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(onResponse, onResponseError);

export default apiClient;
