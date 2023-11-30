import apiClient from "./client";
import { errorResolver } from "../resolvers/apiResolvers";

const notes = {
  saveNote(payload: { userId: string; note: any | null }) {
    return apiClient
      .put(`/users/${payload.userId}/notes`, payload.note)
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
  deleteNote(payload: { userId: string; notesId: string }) {
    console.log(payload.notesId);
    return apiClient
      .delete(`/users/${payload.userId}/notes`, {
        data: {
          notesId: payload.notesId,
        },
      })
      .then((res: any) => {
        return res.data;
      })
      .catch(errorResolver);
  },
};
export default notes;
