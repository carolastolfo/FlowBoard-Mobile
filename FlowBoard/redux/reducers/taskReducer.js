import { FETCH_TASKS, ADD_TASK, EDIT_TASK, DELETE_TASK, TOGGLE_COMPLETION_STATUS, UPDATE_TASK_DUE_DATE, ADD_TAG_TO_TASK, DELETE_TAG, UPDATE_TASK_STATUS } from "../actionTypes";

const initialState = {
  listOfTasks: [],
}

export const taskReducer = (state = initialState, action) => {

  console.log(`taskReducer received action: ${action.type}
      \n payload : ${JSON.stringify(action.payload)}`);

  switch (action.type) {
    case FETCH_TASKS: {
      return {
        ...state,
        listOfTasks: action.payload
      };
    }
    case ADD_TASK: {
      return state
    }
    case EDIT_TASK: {
      return state
    }
    case TOGGLE_COMPLETION_STATUS:
      return {
        ...state,
        listOfTasks: state.listOfTasks.map((task) =>
          task.id === action.payload.taskId
            ? { ...task, completed: action.payload.updatedStatus === 'done', status: action.payload.updatedStatus }
            : task
        ),
      };
    case DELETE_TASK: {
      return state
    }
    case UPDATE_TASK_DUE_DATE: {
      return state
    }
    case ADD_TAG_TO_TASK: {
      return state
    }
    case DELETE_TAG: {
      return state
    }
    case UPDATE_TASK_STATUS: {
      return state
    }
    default: {
      return state
    }
  }
}
