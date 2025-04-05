import {
  LOGIN_REQUEST,
  REGISTER,
  SET_BOARDS,
  SEARCH_BOARD,
  JOIN_BOARD,
  ACCEPT_JOIN,
  REJECT_JOIN,
  FETCH_JOIN_REQUESTS,
} from "../actionTypes";
import { data } from "../../data/data";


const initialState = {
  currentUser: null,
  users: [
    {
      id: 1,
      username: "john_doe",
      email: "john@example.com",
      password: "hashed_password",
      role: "admin",
      boards: [101, 102],
    },
    {
      id: 2,
      username: "jane_smith",
      email: "jane@example.com",
      password: "hashed_password",
      role: "user",
      boards: [101],
    },
    {
      id: 3,
      username: "admin",
      email: "admin@example.com",
      password: "admin",
      role: "admin",
      boards: [101],
    },
  ],
  boards: [],
  joinRequests: [],
  error: "",
};

export const boardReducer = (state = initialState, action) => {
  console.log(`boardReducer received action: ${action.type}
        \n payload: ${JSON.stringify(action.payload)}`);

  switch (action.type) {
    case LOGIN_REQUEST: {
      const { username, password } = action.payload;

      console.log(`Login request received
                    \n credentials: ${JSON.stringify(action.payload)}`);

      const user = state.users.find(
        (user) => user.username === username && user.password === password
      );

      if (user) {
        console.log("Login successful for:", username);
        // You can return some kind of user state update here if needed
        return {
          ...state,
          // set a current user
          currentUser: user,
        };
      } else {
        console.log("Login failed: User not found or incorrect password");
        return {
          ...state,
          currentUser: null, // clear current user on failure
        };
      }
    }
    case "LOGOUT_USER":
      console.log(`Board reducer received logout request`)
      return {
        ...state,
        currentUser: null,
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
