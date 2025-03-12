import { LOGIN, REGISTER } from "../actionTypes"

const initialState = {
    users: [
        {
            id: 1,
            username: "john_doe",
            email: "john@example.com",
            password: "hashed_password",
            role: "admin",
            boards: [101, 102],
        },
        {
            id: 2,
            username: "jane_smith",
            email: "jane@example.com",
            password: "hashed_password",
            role: "user",
            boards: [101],
        },
        {
            id: 3,
            username: "admin",
            email: "admin@example.com",
            password: "admin",
            role: "admin",
            boards: [101],
        },
    ],
}


export const boardReducer = (state=initialState, action) => {}