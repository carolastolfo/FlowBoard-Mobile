import { deleteTask } from "../redux/actions";
import { Alert } from "react-native";

export const handleDelete = (dispatch, taskId) => {

  Alert.alert(
    "Delete a task",
    "Are you sure you want to delete this task?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => {
          dispatch(deleteTask(taskId));
        },
        style: "destructive",
      },
    ]
  );
};