import { combineReducers } from "redux";

import { boardReducer } from "./boardReducer";

export const rootReducer = combineReducers({boardsRoot: boardReducer})