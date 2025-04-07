import { addTask } from '../redux/actions';

export const handleAddTask = (dispatch, taskName, boardId, status = 'todo', dueDate, tag = []) => {

  const newTask = {
    boardId: boardId,
    name: taskName,
    completed: false,
    status: status,
    dueDate: dueDate || "",
    tag: Array.isArray(tag) ? tag : [tag]
  };

  dispatch(addTask(newTask));
};