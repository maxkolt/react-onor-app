import { SET_TOKEN_EXISTS } from "../actions/types/productTypes";

const initialState = {
    tokenExists: false,
  };
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_TOKEN_EXISTS:
        return {
          ...state,
          tokenExists: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default reducer;