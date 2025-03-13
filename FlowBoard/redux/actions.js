import { LOGIN_REQUEST, REGISTER, SEARCH_BOARD, SET_BOARDS } from "./actionTypes";

export const loginRequest = (username, password) => ({
    type: LOGIN_REQUEST,
    payload: {username, password}
})

export const register = (username, email, password) => ({
    type: REGISTER,
    payload: {username, email, password}
})

export const searchBoard = (boardId, currentUserId) => ({
    type: SEARCH_BOARD,
    payload: { boardId, currentUserId },
});

export const setBoards = (currentUserId) => ({
    type: SET_BOARDS,
    payload: { currentUserId },
});