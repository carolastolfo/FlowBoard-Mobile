import { LOGIN, REGISTER } from "./actionTypes";

export const login = (username, password) => ({
    type: LOGIN,
    payload: {username, password}
})

export const register = (username, email, password) => ({
    type: REGISTER,
    payload: {username, email, password}
})