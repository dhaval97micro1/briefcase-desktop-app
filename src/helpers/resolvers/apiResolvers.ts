import {AxiosResponse} from 'axios';

export const responseResolver = (response: AxiosResponse) => {
  if (response.data?.status === false) {
    return Promise.reject(response.data?.message || response.data?.response);
  }
  return response.data;
};
export const errorResolver = (error: {response: {data: {message: string}}}) => {
  return Promise.reject(error?.response?.data?.message || error?.toString());
};
