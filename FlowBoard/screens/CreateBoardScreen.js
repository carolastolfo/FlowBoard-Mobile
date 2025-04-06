import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { createBoard } from "../redux/actions"; 

const CreateBoardScreen = ({ navigation }) => {
  const [boardName, setBoardName] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff"); 
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const currentUserId = useSelector(state => state.usersRoot.currentUser.id)

  const handleCreateBoard = () => {
    // reset any previous errors
    setError("");

    // validate input fields
    if (!boardName || !backgroundColor) {
      setError("Please provide a board name and background color.");
      return;
    }

    setLoading(true);

    dispatch(createBoard(currentUserId, { name: boardName, background_color: backgroundColor, team_members: teamMembers }))
      .then(() => {
        // redirect to board list screen after board creation
        navigation.navigate("Boards");
      })
      .catch((err) => {
        setLoading(false);
        setError("Error creating board, please try again.");
        console.error(err);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Create a New Board</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Board Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter board name"
            value={boardName}
            onChangeText={setBoardName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Background Color</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter background color (e.g. #ffffff)"
            value={backgroundColor}
            onChangeText={setBackgroundColor}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleCreateBoard}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Create Board</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5D4ED',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-start",
    paddingVertical: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 15,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#E5D4ED',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6D72C3',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6D72C3',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CreateBoardScreen;
