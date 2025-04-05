import {
  LOGIN_REQUEST,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  LOGOUT_REQUEST,
  LOGOUT_FAILURE,
  LOGOUT_SUCCESS,
  REGISTER_REQUEST,
  REGISTER_FAILURE,
  REGISTER_SUCCESS,
  CREATE_BOARD,
  SEARCH_BOARD,
  SET_BOARDS,
  FETCH_TASKS,
  ADD_TASK,
  EDIT_TASK,
  DELETE_TASK,
  TOGGLE_COMPLETION_STATUS,
  UPDATE_TASK_DUE_DATE,
  JOIN_BOARD,
  ACCEPT_JOIN,
} from "./actionTypes";
import { db, auth } from "../config/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  getDocs,
  where,
  query,
  getDoc,
  setDoc,
  arrayUnion,
} from "firebase/firestore";

const taskCollection = "kanbantasks";
const collectionRef = collection(db, taskCollection);

const usersCollection = collection(db, "users");
const boardsCollection = collection(db, "boards");
const joinRequestsCollection = collection(db, "joinRequests");

// register user with username, email, password
export const registerUser = (username, email, password) => {
  console.log("registerUser action creator called with:", username, email);
  return async (dispatch) => {
    dispatch({ type: REGISTER_REQUEST });

    try {
      console.log("Attempting to create user in Firebase");
      // create user with email/password in firebase authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // update the profile to add the username as displayName
      await updateProfile(user, {
        displayName: username,
      });

      // store info in Firestore
      await setDoc(doc(usersCollection, user.uid), {
        username,
        email,
        boards: [],
        createdAt: new Date(),
      });

      dispatch({
        type: REGISTER_SUCCESS,
        payload: {
          id: user.uid,
          email: user.email,
          username: username,
        },
      });

      console.log("Registration successful for:", username);
      return user;
    } catch (error) {
      console.error("Registration failed:", error.message);

      dispatch({
        type: REGISTER_FAILURE,
        payload: { error: error.message },
      });

      return null;
    }
  };
};

// login with email and password, but retrieve username from profile or DB
export const loginUser = (email, password) => {
  return async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST, payload: { email } });

    console.log(`Login request received
                      \n credentials: ${JSON.stringify({ email })}`);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      let username = user.displayName;

      // if username not in auth profile, try to get from Firestore
      if (!username) {
        const userDoc = await getDoc(doc(usersCollection, user.uid));
        if (userDoc.exists()) {
          username = userDoc.data().username;
        }
      }

      console.log("Login successful for:", email);

      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          id: user.uid,
          email: user.email,
          username: username,
        },
      });

      return user;
    } catch (error) {
      console.log("Login failed:", error.message);

      dispatch({
        type: LOGIN_FAILURE,
        payload: { error: error.message },
      });

      return null;
    }
  };
};

// logout
export const logoutUser = () => {
  return async (dispatch) => {
    dispatch({ type: LOGOUT_REQUEST });
    console.log(`Board reducer received logout request`);

    try {
      await signOut(auth);

      dispatch({ type: LOGOUT_SUCCESS });
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error.message);

      dispatch({
        type: LOGOUT_FAILURE,
        payload: { error: error.message },
      });
    }
  };
};

// create board
export const createBoard = (userId, boardData) => async (dispatch) => {
  try {
    // create the board document in Firestore
    const newBoard = {
      name: boardData.name,
      background_color: boardData.background_color,
      team_members: boardData.team_members.map((memberRef) => memberRef.id), // user ids
      owner_id: userId,
    };
    const newBoardRef = await addDoc(boardsCollection, newBoard);

    // add the new board reference to the user's boards array
    const userDocRef = doc(usersCollection, userId);
    await updateDoc(userDocRef, {
      boards: arrayUnion(newBoardRef), // add the new board reference to the user's boards array
    });

    console.log("Board created and linked to user successfully!");

    // Dispatch the action to the store with the new board data
    dispatch({
      type: CREATE_BOARD,
      payload: {
        id: newBoardRef.id,
        name: boardData.name,
        background_color: boardData.background_color,
        team_members: boardData.team_members.map((memberRef) => memberRef.id),
        owner_id: userId,
      },
    });
  } catch (error) {
    console.error("Error creating board or linking to user:", error);
  }
};

//Boards list
export const setBoards = (currentUserId) => async (dispatch) => {
  try {
    // Fetch user document
    const userDocRef = doc(usersCollection, currentUserId);
    const userSnapshot = await getDoc(userDocRef);

    // Ensure user data exists
    const userData = userSnapshot.exists() ? userSnapshot.data() : null;
    if (!userData || !Array.isArray(userData.boards)) {
      dispatch({ type: SET_BOARDS, payload: { boards: [] } });
      return;
    }

    // Extract string IDs from DocumentReferences
    const boardIds = userData.boards.map((boardRef) => boardRef.id);

    // Fetch each board document by ID
    const boardRefs = boardIds.map((boardId) => doc(db, "boards", boardId));
    const boardSnapshots = await Promise.all(boardRefs.map(getDoc));

    // Convert board data and replace Firestore DocumentReference with its ID
    const boards = boardSnapshots
      .filter((snap) => snap.exists())
      .map((snap) => {
        const boardData = snap.data();
        return {
          id: snap.id,
          name: boardData.name,
          background_color: boardData.background_color,
          team_members: boardData.team_members.map((memberRef) => memberRef.id), // No ref just user ID
          owner_id:
            boardData.owner_id &&
            typeof boardData.owner_id === "object" &&
            boardData.owner_id.id
              ? boardData.owner_id.id
              : boardData.owner_id || null,
        };
      });

    dispatch({ type: SET_BOARDS, payload: { boards } });
  } catch (error) {
    console.error("Error fetching boards:", error);
  }
};

// Search board by name
export const searchBoard = (boardName) => async (dispatch) => {
  try {
    const snapshot = await getDocs(boardsCollection);

    const foundBoards = snapshot.docs
      .map((doc) => {
        const boardData = doc.data();
        return {
          id: doc.id,
          name: boardData.name,
          background_color: boardData.background_color,
          team_members: boardData.team_members.map((memberRef) => memberRef.id),
          owner_id:
            boardData.owner_id &&
            typeof boardData.owner_id === "object" &&
            boardData.owner_id.id
              ? boardData.owner_id.id // Extract Firestore document ID
              : boardData.owner_id || null,
        };
      })
      .filter((board) =>
        board.name.toLowerCase().includes(boardName.toLowerCase())
      ); // Case-insensitive search

    if (foundBoards.length > 0) {
      dispatch({ type: SEARCH_BOARD, payload: { boards: foundBoards } });
    } else {
      dispatch({
        type: SEARCH_BOARD,
        payload: { boards: [], error: "Board not found or no access" },
      });
    }
  } catch (error) {
    console.error("Error searching board:", error);
    dispatch({
      type: SEARCH_BOARD,
      payload: { boards: [], error: "An error occurred during search" },
    });
  }
};

// Join board
export const joinBoard = (boardId, userId) => async (dispatch) => {
  try {
    const q = query(
      joinRequestsCollection,
      where("boardId", "==", boardId),
      where("userId", "==", userId)
    );

    // Get the query snapshot
    const querySnapshot = await getDocs(q);

    // Check if the document already exists
    if (querySnapshot.empty) {
      // Create a new join request in the Firestore collection
      await addDoc(joinRequestsCollection, {
        boardId: boardId,
        userId: userId,
        status: "pending", // Set status to "pending" / completed for accepted request
      });

      dispatch({
        type: JOIN_BOARD,
        payload: { boardId, userId, status: "pending" },
      });
      return true;
    } else {
      console.log("Join request already exists for this board and user.");
      return false;
    }
  } catch (error) {
    console.error("Error joining board:", error);
  }
};

// Accept join request
export const acceptJoin = () => async (dispatch) => {
  // add requested UserId to related board's team_members and change join_request doc's status field to completed
};

// Board
export const fetchTasks = () => async (dispatch) => {
  try {
    console.log(`Trying to fetch tasks to database.`);

    const dataListener = onSnapshot(collectionRef, (snapshot) => {
      const taskList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      dispatch({
        type: FETCH_TASKS,
        payload: taskList,
      });
    });

    return dataListener;
  } catch (error) {
    console.error("Error fetching tasks: ", error);
  }
};

export const addTask = (task) => async (dispatch) => {
  try {
    console.log(`Trying to save task to database : ${JSON.stringify(task)}`);

    const docRef = await addDoc(collectionRef, task);

    console.log(`document saved successfully : ${docRef.id}`);

    dispatch({
      type: ADD_TASK,
      payload: {
        id: docRef.id,
        ...task,
      },
    });
  } catch (error) {
    console.error("Error adding task: ", error);
  }
};

export const deleteTask = (taskId) => async (dispatch) => {
  try {
    console.log(`Trying to delete task ID : ${taskId}`);

    const taskRef = doc(db, "kanbantasks", taskId);
    await deleteDoc(taskRef);

    console.log(`document deleted successfully : ${taskId}`);

    dispatch({
      type: DELETE_TASK,
      payload: taskId,
    });
  } catch (error) {
    console.error("Error deleting the task: ", error);
  }
};

export const editTask = (updatedTask) => async (dispatch) => {
  try {
    console.log(`Trying to update task: ${JSON.stringify(updatedTask)}`);

    const docRef = doc(db, "kanbantasks", updatedTask.id);

    await updateDoc(docRef, updatedTask);

    console.log("Task successfully updated!");

    dispatch({
      type: EDIT_TASK,
      payload: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task: ", error);
  }
};

export const toggleCompletionStatus =
  (taskId) => async (dispatch, getState) => {
    try {
      console.log(`Trying to toggleCompletionStatus for task ID: ${taskId}`);

      const taskList = getState().kanbantasks.listOfTasks;
      const task = taskList.find((task) => task.id === taskId);

      if (!task) {
        console.error("Task not found!");
        return;
      }

      const updatedTask = { ...task, completed: !task.completed };

      const taskRef = doc(db, "kanbantasks", taskId);
      await updateDoc(taskRef, {
        completed: updatedTask.completed,
      });

      console.log(
        `Task ID: ${taskId} toggled. Completed: ${updatedTask.completed}`
      );

      dispatch({
        type: TOGGLE_COMPLETION_STATUS,
        payload: updatedTask,
      });
    } catch (error) {
      console.error("Error toggling completion status: ", error);
    }
  };

export const updateTaskDueDate =
  ({ dueDate, taskId }) =>
  async (dispatch) => {
    try {
      console.log(
        `Trying to update Due Date for task ID: ${taskId} with date: ${dueDate}`
      );

      const docRef = doc(db, "kanbantasks", taskId);
      await updateDoc(docRef, { dueDate });

      console.log("Due Date successfully added!");

      dispatch({
        type: UPDATE_TASK_DUE_DATE,
        payload: { taskId, dueDate },
      });
    } catch (error) {
      console.error("Error updating due date:", error);
    }
  };
