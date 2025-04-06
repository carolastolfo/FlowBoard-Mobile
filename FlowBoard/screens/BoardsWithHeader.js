// Add imports
import { TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { useLayoutEffect } from "react";
import { logoutUser } from "../redux/actions";
import BoardsNavigator from "./BoardsNavigator";

// wrapper component for BoardsNavigator to add logout header
const BoardsWithHeader = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.usersRoot.currentUser);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        currentUser ? (
          <TouchableOpacity onPress={handleLogout}>
            <Text style={{ color: "#6D72C3", marginRight: 5 }}>Logout</Text>
          </TouchableOpacity>
        ) : null,
    });
  }, [navigation, currentUser]);

  return <BoardsNavigator />;
};

export default BoardsWithHeader
