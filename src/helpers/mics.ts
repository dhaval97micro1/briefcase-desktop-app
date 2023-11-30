import toast from "react-hot-toast";
import { removeToken } from "./storage";

export function getLastNElements(arr: any, n: number) {
  if (n >= arr.length) {
    return arr.slice(); // Return a copy of the entire array
  } else {
    return arr.slice(arr.length - n); // Return the last N elements
  }
}

export function createPairs(arr: any) {
  return arr.reduce((result: any, value: any, index: number, array: any) => {
    if (index % 2 === 0) {
      result.push([value, array[index + 1]]);
    }
    return result;
  }, []);
}

export const resetFlow = async ({ logout = false }: { logout?: boolean }) => {
  if (logout) {
    await removeToken();
  }
};

export const showMsg = (msg: string) => {
  toast.dismiss();
  toast.success(msg);
};

export const showError = (msg: string) => {
  toast.dismiss();
  toast.error(msg);
};
