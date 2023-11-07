import { LoginRequestType } from "../types/auth.types";
import apiClient from "./client";
import { errorResolver } from "../resolvers/apiResolvers";

const auth = {
  login(payload: LoginRequestType) {
    return apiClient
      .post("/auth/login", payload)
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
};
export default auth;
