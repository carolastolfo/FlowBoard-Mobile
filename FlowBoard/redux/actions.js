import { LOGIN, REGISTER } from "./actionTypes";

export const login = (username, password) => ({
    type: LOGIN,
    payload: {username, password}
})

export const register = (username, email, password) => ({
    type: REGISTER,
    payload: {username, email, password}
})

export const loadUserBoards = (currentUserId) => ({
    type: LOAD_USER_BOARDS,
    payload: { currentUserId },
});

export const searchBoard = (searchId, currentUserId) => ({
    type: SEARCH_BOARD,
    payload: { searchId, currentUserId },
});

export const setBoards = (boards) => ({
    type: SET_BOARDS,
    payload: boards,
});

export const setError = (error) => ({
    type: SET_ERROR,
    payload: error,
});