import apiClient from "./client";
import { errorResolver } from "../resolvers/apiResolvers";
import * as API from "../../consts/API_URLS";

const docs = {
  manageDocs(payload: { q: string; history: string[][] }) {
    return apiClient
      .post(API.DOCS, payload)
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
  getFilesList(payload: { userId: string; fileType: string }) {
    return apiClient
      .get(`/users/${payload.userId}/files?file_type=${payload.fileType}`)
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
};
export default docs;
