import { UserDetailsType } from "./types/user.types";

const setToken = (token: string) => {
  localStorage.setItem("token", token);
};
const getToken = () => {
  return localStorage.getItem("token");
};
const removeToken = () => {
  localStorage.removeItem("token");
};
const getLastStoredTodos = () => {
  return localStorage.getItem("lastTodos");
};
const storeTodos = (messages: string) => {
  return localStorage.setItem("lastTodos", messages);
};
const getLastStoredDocsChat = (fileType: string) => {
  return localStorage.getItem("lastDocsChat_" + fileType);
};
const storeDocsChat = (fileType: string, messages: string) => {
  return localStorage.setItem("lastDocsChat_"+ fileType, messages);
};
const storeUser = (user: UserDetailsType) => {
  localStorage.setItem("user", JSON.stringify(user));
};
const getStoredUser = () => {
  return localStorage.getItem("user");
};
const clearStorage = () => {
  localStorage.clear();
};

export {
  setToken,
  getToken,
  removeToken,
  getLastStoredTodos,
  storeTodos,
  getLastStoredDocsChat,
  storeDocsChat,
  storeUser,
  getStoredUser,
  clearStorage,
};
