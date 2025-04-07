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
          dispatch(deleteTag({ taskId, tag }));
        },
        style: "destructive",
      },
    ]
  );
};