import { LOGIN_REQUEST, REGISTER } from "./actionTypes";

export const loginRequest = (username, password) => ({
    type: LOGIN_REQUEST,
    payload: {username, password}
})

export const register = (username, email, password) => ({
    type: REGISTER,
    payload: {username, email, password}
})