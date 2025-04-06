import {
  CREATE_BOARD,
  SET_BOARDS,
  SEARCH_BOARD,
  JOIN_BOARD,
  ACCEPT_JOIN,
  REJECT_JOIN,
  FETCH_JOIN_REQUESTS,
} from "../actionTypes";


const initialState = {
  boards: [],
  joinRequests: [],
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
    
    case FETCH_JOIN_REQUESTS:
      return { 
        ...state,
        joinRequests: action.payload
      };
    
    case ACCEPT_JOIN:
    case REJECT_JOIN:
      return {
        ...state,
        joinRequests: state.joinRequests.filter(r => r.id !== action.payload)
      };

    default:
      return state;
  }
};
