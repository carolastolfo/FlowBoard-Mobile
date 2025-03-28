import { addTask } from '../redux/actions';

export const handleAddTask = (dispatch, taskName, status = 'todo', dueDate) => {

  const newTask = {
    name: taskName,
    completed: false,
    status: status,
    dueDate: dueDate || "",
  };

  dispatch(addTask(newTask));
};
