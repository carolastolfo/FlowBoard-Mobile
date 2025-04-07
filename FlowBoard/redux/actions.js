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
  ADD_TAG_TO_TASK,
  DELETE_TAG,
  JOIN_BOARD,
  ACCEPT_JOIN, REJECT_JOIN, FETCH_JOIN_REQUESTS
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
  arrayRemove,
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
      team_members: userId,
      owner_id: userId,
    };
    const newBoardRef = await addDoc(boardsCollection, newBoard);

    // add the new board reference to the user's boards array
    const userDocRef = doc(usersCollection, userId);
    await updateDoc(userDocRef, {
      boards: arrayUnion(newBoardRef), // add the new board reference to the user's boards array
    });

    console.log("Board created and linked to user successfully!");

    // dispatch the action to the store with the new board data
    dispatch({
      type: CREATE_BOARD,
      payload: {
        id: newBoardRef.id,
        name: boardData.name,
        background_color: boardData.background_color,
        team_members: userId,
        owner_id: userId,
      },
    });
  } catch (error) {
    console.error("Error creating board or linking to user:", error);
  }
}

//  Join requests list
export const fetchJoinRequests = (currentUserId) => async (dispatch) => {
  try {
    const boardsSnapshot = await getDocs(boardsCollection);
    const ownedBoards = [];

    // Get boards that current user is an owner
    boardsSnapshot.forEach(docSnap => {
      const data = docSnap.data();
      if (data.owner_id.id === currentUserId) {
        ownedBoards.push({ id: docSnap.id, ...data });
      }
    });

    const joinRequests = [];

    // Get join request for each board
    for (const board of ownedBoards) {
      const q = query(
        joinRequestsCollection,
        where('boardId', '==', board.id),
        where('status', '==', 'pending')
      );

      const reqSnapshot = await getDocs(q);
      for (const reqDoc of reqSnapshot.docs) {
        const request = reqDoc.data();

        // Get requested user info
        const userRef = doc(usersCollection, request.userId);
        const userSnap = await getDoc(userRef);
        const username = userSnap.exists() ? userSnap.data().username : 'Unknown User';

        joinRequests.push({
          id: reqDoc.id,
          boardId: request.boardId,
          userId: request.userId,
          username,
        });
      }
    }

    dispatch({
      type: FETCH_JOIN_REQUESTS,
      payload: joinRequests,
    });
  } catch (error) {
    console.error("Failed to fetch join requests:", error);
  }
};

// Accept join request
export const acceptJoin = (joinRequest) => async dispatch => {
  try {
    const { boardId, userId, id: requestId } = joinRequest; // Destruct joinRequest

    // Add user to team_members
    const boardRef = doc(boardsCollection, boardId);
    await updateDoc(boardRef, {
      team_members: arrayUnion(`/users/${userId}`)
    });

    // Update join request status
    const joinRequestRef = doc(joinRequestsCollection, requestId);
    await updateDoc(joinRequestRef, {
      status: "accepted"
    });

    dispatch({ type: ACCEPT_JOIN, payload: requestId });
  } catch (error) {
    console.error("Failed to accept join request", error);
  }
};

// Reject join request
export const rejectJoin = (joinRequestId) => async dispatch => {
  try {
    const joinRequestRef = doc(joinRequestsCollection, joinRequestId);

    // Update join request status
    await updateDoc(joinRequestRef, {
      status: "rejected"
    });

    dispatch({ type: REJECT_JOIN, payload: joinRequestId });
  } catch (error) {
    console.error("Failed to reject join request", error);
  }
};

//Boards list
const boardListeners = {};
const boardsMap = {};
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

    const unsubscribers = []; // store unsubscribe functions

    boardIds.forEach((boardId) => {
      const boardRef = doc(boardsCollection, boardId);

      // Avoid duplicate listeners
      if (boardListeners[boardId]) return;

        // Collect a stop function the Firestore gives us / onSnapshot returns a function that can stop listening
        const unsubscribe = onSnapshot(boardRef, (snap) => {
          if (!snap.exists()) return;
  
          const boardData = snap.data();
          boardsMap[boardId] = {
            id: boardId,
            name: boardData.name,
            background_color: boardData.background_color,
            team_members: boardData.team_members.map((ref) => ref.id),
            owner_id:
              boardData.owner_id &&
              typeof boardData.owner_id === 'object' &&
              boardData.owner_id.id
              ? boardData.owner_id.id
              : boardData.owner_id || null,
        };

          dispatch({
            type: SET_BOARDS,
            payload: { boards: Object.values(boardsMap) }
          });
        });
  
        boardListeners[boardId] = unsubscribe;
        unsubscribers.push(unsubscribe);
      });
  
      // Return a cleanup function to stop listening
      return () => { 
        unsubscribers.forEach((unsub) => unsub());
        Object.keys(boardListeners).forEach((id) => delete boardListeners[id]);
        Object.keys(boardsMap).forEach((id) => delete boardsMap[id]);
      };

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

// Fletch Tasks
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

// Add Tasks
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

// Delete Tasks
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

// Edit Tasks
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

// Toggle Status
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

// Update Due Date  
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

// Add Tags
export const addTagToTask =
  ({ taskId, tag }) => async (dispatch) => {
    try {
      console.log(
        `Trying to add tag for task ID: ${taskId} with tag: ${tag}`
      );
      const docRef = doc(db, "kanbantasks", taskId);
      await updateDoc(docRef, { tag: arrayUnion(...tag) });

      console.log("Tag successfully added!");

      dispatch({
        type: ADD_TAG_TO_TASK,
        payload: { taskId, tag },
      });

    } catch (error) {
      console.error("Error updating tag:", error);
    }
  };

// Delete Tag
export const deleteTag = ({ taskId, tag }) => async (dispatch) => {

  // if (Array.isArray(tag)) {
  //   tag = tag[0];
  //   console.log("Using the first item from the array:", tag);
  // }

  try {
    console.log(`Trying to delete tag for task ID : ${taskId} with tag: ${tag}`);

    const docRef = doc(db, "kanbantasks", taskId);

    console.log("Tag being deleted: ", tag);
    await updateDoc(docRef, {
      tag: arrayRemove(tag),
    });

    console.log("Tag successfully deleted!");

    dispatch({
      type: DELETE_TAG,
      payload: { taskId, tag },
    });

  } catch (error) {
    console.error("Error deleting the tag: ", error);
  }
};



