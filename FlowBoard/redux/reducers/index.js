import { combineReducers } from "redux";

import { boardReducer } from "./boardReducer";
import { taskReducer } from "./taskReducer";
import userReducer from "./userReducer";

export const rootReducer = combineReducers({
  boardsRoot: boardReducer,
  usersRoot: userReducer,
  kanbantasks: taskReducer
})


