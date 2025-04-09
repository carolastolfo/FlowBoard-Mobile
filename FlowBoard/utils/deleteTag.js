import { deleteTag } from "../redux/actions";
import { Alert } from "react-native";

export const handleDeleteTag = (dispatch, taskId, tag) => {

  Alert.alert(
    "Delete a tag",
    "Are you sure you want to delete this tag?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => {
          console.log("Calling deleteTag for task:", taskId, "and tag:", tag);
          dispatch(deleteTag({ taskId, tag }));
        },
        style: "destructive",
      },
    ]
  );
};