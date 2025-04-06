import { addTask } from '../redux/actions';

export const handleAddTask = (dispatch, taskName, boardId, status = 'todo', dueDate) => {

  const newTask = {
    boardId: boardId,
    name: taskName,
    completed: false,
    status: status,
    dueDate: dueDate || "",
  };

  dispatch(addTask(newTask));
};
