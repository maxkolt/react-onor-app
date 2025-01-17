import { SET_TOKEN_EXISTS } from "../types/productTypes";

export const setTokenExists = (exists) => {
    return {
      type: SET_TOKEN_EXISTS,
      payload: exists,
    };
  };