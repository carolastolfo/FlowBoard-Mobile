import { LOGIN_REQUEST, LOGOUT_USER, REGISTER, SEARCH_BOARD, SET_BOARDS, FETCH_TASKS, ADD_TASK, EDIT_TASK, DELETE_TASK, TOGGLE_COMPLETION_STATUS, UPDATE_TASK_DUE_DATE } from "./actionTypes";
import { db } from '../config/firebaseConfig';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, getDocs, where, query, getDoc } from 'firebase/firestore';

const taskCollection = "kanbantasks"
const collectionRef = collection(db, taskCollection)

const usersCollection = collection(db, "users");
const boardsCollection = collection(db, "boards");

export const loginRequest = (username, password) => ({
    type: LOGIN_REQUEST,
    payload: { username, password }
})

export const logoutUser = () => ({
    type: LOGOUT_USER
});

export const register = (username, email, password) => ({
    type: REGISTER,
    payload: { username, email, password }
})

//Boards
export const setBoards = (currentUserId) => async (dispatch) => {
    try {
        // Get the user's data to fetch board IDs (boards field has the info)
        const userDocRef = doc(usersCollection, currentUserId);
        const userSnapshot = await getDoc(userDocRef);
        const userData = userSnapshot.data();

        const userBoardIds = userData.boards || []; // Get board id

        if (userBoardIds.length === 0) { // If a user doesn't have any board
            dispatch({ type: SET_BOARDS, payload: { boards: [] } });
            return;
        }

        const boardRefs = userBoardIds.map((boardId) => doc(db, "boards", boardId));

        const boardSnapshots = await Promise.all(boardRefs.map(getDoc));
        const boards = boardSnapshots
            .filter((snap) => snap.exists()) // Ensure document exists
            .map((snap) => ({ id: snap.id, ...snap.data() }));

        // console.log("Fetched boards:", boards);

        dispatch({ type: SET_BOARDS, payload: { boards } });
    } catch (error) {
        console.error("Error fetching boards:", error);
    }
};

export const searchBoard = (boardName) => async (dispatch) => {
    try {
        const q = query(boardsCollection, where("name", "==", boardName));
        const snapshot = await getDocs(q);
        const foundBoards = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        if (foundBoards.length > 0) {
            dispatch({ type: SEARCH_BOARD, payload: { boards: foundBoards } });
        } else {
            dispatch({ type: SEARCH_BOARD, payload: { boards: [], error: "Board not found or no access" } });
        }
    } catch (error) {
        console.error("Error searching board:", error);
        dispatch({ type: SEARCH_BOARD, payload: { boards: [], error: "An error occurred during search" } });
    }
};

// Board
export const fetchTasks = () => async dispatch => {
    try {
        console.log(`Trying to fetch tasks to database.`);

        const dataListener = onSnapshot(collectionRef, snapshot => {

            const taskList = snapshot.docs.map((doc) => (
                {
                    id: doc.id,
                    ...doc.data()
                }
            ))

            dispatch({
                type: FETCH_TASKS,
                payload: taskList
            })
        })

        return dataListener

    } catch (error) {
        console.error("Error fetching tasks: ", error);
    }
};


export const addTask = (task) => async dispatch => {
    try {
        console.log(`Trying to save task to database : ${JSON.stringify(task)}`);

        const docRef = await addDoc(collectionRef, task)

        console.log(`document saved successfully : ${docRef.id}`);

        dispatch({
            type: ADD_TASK,
            payload: {
                id: docRef.id,
                ...task
            }
        })

    } catch (error) {
        console.error("Error adding task: ", error);
    }
};

export const deleteTask = (taskId) => async dispatch => {
    try {
        console.log(`Trying to delete task ID : ${taskId}`);

        const taskRef = doc(db, "kanbantasks", taskId);
        await deleteDoc(taskRef);

        console.log(`document deleted successfully : ${taskId}`);

        dispatch({
            type: DELETE_TASK,
            payload: taskId
        })
    } catch (error) {
        console.error("Error deleting the task: ", error);
    }
}

export const editTask = (updatedTask) => async dispatch => {
    try {
        console.log(`Trying to update task: ${JSON.stringify(updatedTask)}`);

        const docRef = doc(db, "kanbantasks", updatedTask.id);

        await updateDoc(docRef, updatedTask);

        console.log("Task successfully updated!");

        dispatch({
            type: EDIT_TASK,
            payload: updatedTask
        });
    } catch (error) {
        console.error("Error updating task: ", error);
    }
};

export const toggleCompletionStatus = (taskId) => async (dispatch, getState) => {
    try {
        console.log(`Trying to toggleCompletionStatus for task ID: ${taskId}`);

        const taskList = getState().kanbantasks.listOfTasks;
        const task = taskList.find(task => task.id === taskId);

        if (!task) {
            console.error("Task not found!");
            return;
        }

        const updatedTask = { ...task, completed: !task.completed };

        const taskRef = doc(db, "kanbantasks", taskId);
        await updateDoc(taskRef, {
            completed: updatedTask.completed
        });

        console.log(`Task ID: ${taskId} toggled. Completed: ${updatedTask.completed}`);

        dispatch({
            type: TOGGLE_COMPLETION_STATUS,
            payload: updatedTask,
        });

    } catch (error) {
        console.error("Error toggling completion status: ", error);
    }
};

export const updateTaskDueDate = ({ dueDate, taskId }) => async dispatch => {

    try {
        console.log(`Trying to update Due Date for task ID: ${taskId} with date: ${dueDate}`);

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




