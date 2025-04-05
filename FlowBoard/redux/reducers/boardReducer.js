import {
  CREATE_BOARD,
  SET_BOARDS,
  SEARCH_BOARD,
  JOIN_BOARD,
  ACCEPT_JOIN
} from "../actionTypes";
import { data } from "../../data/data";


const initialState = {
  boards: [],
  error: "",
};

export const boardReducer = (state = initialState, action) => {
  console.log(`boardReducer received action: ${action.type}
        \n payload: ${JSON.stringify(action.payload)}`);

  switch (action.type) {
    case CREATE_BOARD:
      return {
        ...state,
        boards: [...state.boards, action.payload], 
      };

    case SET_BOARDS:
      return {
        ...state,
        boards: action.payload.boards,
        error: "",
      };

    case SEARCH_BOARD:
      return {
        ...state,
        boards: action.payload.boards,
        error: action.payload.error || "",
      };
    
    case JOIN_BOARD:
      return state
    
    case ACCEPT_JOIN:
      return state

    default:
      return state;
  }
};
