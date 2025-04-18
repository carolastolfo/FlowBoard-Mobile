import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect, useRef } from "react";
import { AntDesign } from "@expo/vector-icons";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Alert,
} from "react-native";
import { searchBoard, setBoards, joinBoard, deleteBoard } from "../redux/actions";

const BoardsScreen = ({ navigation }) => {
    const currentUserId = useSelector((state) => state.usersRoot.currentUser.id);
    const currentUser = useSelector((state) => state.usersRoot.currentUser);
    const boards = useSelector((state) => state.boardsRoot.boards);
    const error = useSelector((state) => state.boardsRoot.error);
    const dispatch = useDispatch();
    const [boardName, setBoardName] = useState("");
    const cleanupRef = useRef(null); // hold unsubscribe function

    useEffect(() => {
        (async () => {
            // The returned function is a cleanup callback to unsubscribe listeners
            cleanupRef.current = await dispatch(setBoards(currentUserId));
        })();
        // Clean up when the component unmounts or dependencies change
        return () => {
            if (cleanupRef.current) cleanupRef.current();  // Unsubscribe from board listeners
        };
    }, [dispatch]);

    const handleSearch = () => {
        if (boardName) {
            dispatch(searchBoard(boardName));
        }
    };

    const handleReset = async () => {
        setBoardName("");
        // stop old listeners
        if (cleanupRef.current) cleanupRef.current();
        // start fresh listeners
        cleanupRef.current = await dispatch(setBoards(currentUserId));
    };

    // To redirect to board
    const handleRedirect = (board) => {
        setTimeout(() => {
            console.log("Navigating to board:", board.id);
            const isCurrentUserInTeam = board.team_members.find(
                (member) => member === currentUserId
            )
            if (isCurrentUserInTeam) {
                navigation.navigate("KanbanBoard", { boardId: board.id });
            } else {
                Alert.alert("", "You don't have permission to access this board");
            }
        }, 500);
    };

    const handleJoinBoard = async (boardId) => {
        console.log("Joining board:", boardId);

        const success = await dispatch(joinBoard(boardId, currentUserId));

        if (!success) {
            Alert.alert("", "You already requested to join this board.");
        } else {
            Alert.alert(
                "",
                "Request sent successfully. Please wait for the owner's approval."
            );
        }
    };

    const handleDeleteBoard = (boardId) => {
        // confirmation dialog
        Alert.alert(
            "Delete Board",
            "Are you sure you want to delete this board? This action cannot be undone.",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        const result = await dispatch(deleteBoard(boardId, currentUserId));

                        if (result.success) {
                            console.log("Board deleted successfully");
                        } else {
                            Alert.alert("Error", result.error || "Failed to delete board");
                        }
                    }
                }
            ]
        );
    };

    const renderBoardItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.boardCard, { backgroundColor: item.background_color }]}
            onPress={() => handleRedirect(item)}
        >
            <View style={styles.titleContainer}>
                <Text style={styles.boardTitle}>{item.name}</Text>
                {item.owner_id === currentUserId && (
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={(e) => {
                            e.stopPropagation(); // prevent triggering the card's onPress
                            handleDeleteBoard(item.id);
                        }}
                    >
                        <AntDesign name="close" size={18} color="black" />
                    </TouchableOpacity>
                )}
            </View>
            <Text style={styles.teamMembers}>
                Team Members: {item.team_members.length}
            </Text>

            <View style={styles.badgeContainer}>
                {item.owner_id === currentUserId && (
                    <Text style={styles.badge}>Owner</Text>
                )}
                {!item.team_members.includes(currentUserId) && (
                    <TouchableOpacity
                        style={styles.joinButton}
                        onPress={() => handleJoinBoard(item.id, item.team_members)}
                    >
                        <Text style={styles.badge}>Join</Text>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>
                    {currentUser ? currentUser.username + "'s" : "My"} Boards
                </Text>
                <View style={styles.searchContainer}>
                    <TextInput
                        placeholder="Search by Board Name"
                        style={styles.searchInput}
                        value={boardName}
                        onChangeText={setBoardName}
                    />
                    <TouchableOpacity onPress={handleSearch} style={styles.button}>
                        <Text style={styles.buttonText}>Search</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleReset} style={styles.button}>
                        <Text style={styles.buttonText}>Show All</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Error message */}
            {error ? <Text style={styles.errorMessage}>{error}</Text> : null}

            {/* Boards Grid */}
            {boards.length > 0 ? (
                <FlatList
                    data={boards}
                    renderItem={renderBoardItem}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    style={styles.boardsGrid}
                />
            ) : (
                <Text style={styles.noBoards}>No boards found.</Text>
            )}
            <View
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    height: "50",
                    marginBottom: 60,
                }}
            >
                <TouchableOpacity
                    style={styles.createButton}
                    onPress={() => navigation.navigate("CreateBoard")}
                >
                    <Text style={styles.buttonText}>Create a New Board</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#E5D4ED",
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    searchContainer: {
        flexDirection: "row",
        marginBottom: 10,
    },
    searchInput: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 4,
        paddingHorizontal: 10,
        backgroundColor: "#fff",
    },
    button: {
        backgroundColor: "#6D72C3",
        padding: 10,
        marginLeft: 10,
        borderRadius: 4,
        justifyContent: "center",
        marginBottom: 50,
    },
    buttonText: {
        color: "white",
        fontSize: 14,
        textAlign: "center",
    },
    createButton: {
        backgroundColor: "#6D72C3",
        width: 200,
        padding: 10,
        borderRadius: 4,
    },
    errorMessage: {
        color: "red",
        marginBottom: 10,
    },
    boardsGrid: {
        flex: 1,
        marginTop: -50
    },
    boardCard: {
        flex: 1,
        margin: 8,
        padding: 16,
        borderRadius: 8,
        minHeight: 120,
        maxWidth: "45%",
    },
    boardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    teamMembers: {
        fontSize: 14,
        marginBottom: 8,
    },
    badge: {
        alignSelf: "flex-start",
        backgroundColor: "rgba(0,0,0,0.3)",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        color: "white",
        fontSize: 12,
    },
    badgeContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    noBoards: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 16,
        color: "#999",
    },
    titleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },

    deleteButton: {
        padding: 3,
        marginBottom: 8,

    },
});

export default BoardsScreen;
