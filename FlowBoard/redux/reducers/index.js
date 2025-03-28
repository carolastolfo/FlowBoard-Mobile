import { combineReducers } from "redux";

import { boardReducer } from "./boardReducer";
import { taskReducer } from "./taskReducer";

export const rootReducer = combineReducers({
  boardsRoot: boardReducer,
  kanbantasks: taskReducer
})


