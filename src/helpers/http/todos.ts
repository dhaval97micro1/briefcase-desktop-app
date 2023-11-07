import apiClient from "./client";
import { errorResolver } from "../resolvers/apiResolvers";

const todos = {
  manageTodo(payload: any) {
    console.log(`/users/${payload.userId}/tasks`);
    return apiClient
      .post(`/users/${payload.userId}/tasks`, {
        q: payload.query,
      })
      .then((res) => {
        return res.data;
      })
      .catch(errorResolver);
  },
};
export default todos;
