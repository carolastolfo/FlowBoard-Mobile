export const data = {
    users: [
        {
            id: 1,
            username: "admin",
            email: "john@example.com",
            password: "admin",
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
    ],
    boards: [
        {
            id: 101,
            name: "Project Alpha",
            owner_id: 1,
            team_members: [2],
            background_color: "beige",
        },
        {
            id: 102,
            name: "Marketing Plan",
            owner_id: 2,
            team_members: [1],
            background_color: "pink",
        },
    ],
    join_requests: [
        {
            id: 1,
            user_id: 2,
            board_id: 102,
            status: "pending",
        },
    ],
};