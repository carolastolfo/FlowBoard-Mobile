import { useDispatch, useSelector } from 'react-redux';

import React, { useState, useEffect, useLayoutEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { searchBoard, setBoards, joinBoard, logoutUser } from '../redux/actions'



const BoardsScreen = ({ navigation }) => {
    const currentUserId = useSelector(state => state.usersRoot.currentUser.id)
    const currentUser = useSelector(state => state.usersRoot.currentUser)

    const dispatch = useDispatch();

    const [boardName, setBoardName] = useState("");
    const boards = useSelector(state => state.boardsRoot.boards);
    const error = useSelector(state => state.boardsRoot.error);

    useEffect(() => {
        dispatch(setBoards(currentUserId));
    }, [dispatch]);

    const handleSearch = () => {
        if (boardName) {
            dispatch(searchBoard(boardName));
        }
    };


    useLayoutEffect(() => {
        navigation.setOptions({
          headerRight: () =>
            currentUser ? (
              <TouchableOpacity onPress={handleLogout}>
                <Text style={{ color: "#6D72C3", marginRight: 5 }}>Logout</Text>
              </TouchableOpacity>
            ) : null,
        });
      }, [navigation, currentUser]);
    
      const handleLogout = () => {
        dispatch(logoutUser());
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      };

    
    const handleReset = () => {
        setBoardName("");
        dispatch(setBoards(currentUserId));
    };

    // To redirect to board
    const handleRedirect = (boardId) => {
        setTimeout(() => {
            console.log("Navigating to board:", boardId);
            navigation.navigate("KanbanBoard", { boardId });
        }, 500);
    };

    const handleJoinBoard = async (boardId) => {
        console.log("Joining board:", boardId);
        dispatch(joinBoard(boardId, currentUserId));
        const success = await dispatch(joinBoard(boardId, currentUserId));

        if (!success) {
            alert("You already requested to join this board.");
        } else {
            alert("Request sent successfully. Please wait for the owner's approval.");
        }
    };

    const renderBoardItem = ({ item }) => (

        <TouchableOpacity
            style={[styles.boardCard, { backgroundColor: item.background_color }]}
            onPress={() => handleRedirect(item.id)}
        >
            <Text style={styles.boardTitle}>{item.name}</Text>
            <Text style={styles.teamMembers}>Team Members: {item.team_members.length}</Text>

            <View style={styles.badgeContainer}>
            {item.owner_id === currentUserId &&
                <Text style={styles.badge}>Owner</Text>
            }
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
                <Text style={styles.title}>{currentUser ? currentUser.username + "'s" : "My"} Boards</Text>
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
                    keyExtractor={item => item.id.toString()}
                    numColumns={2}
                    style={styles.boardsGrid}
                />
            ) : (
                <Text style={styles.noBoards}>No boards found.</Text>
            )}
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('CreateBoard')}
            >

                <Text style={styles.buttonText}>Create a New Board</Text>

            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#E5D4ED',
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    searchInput: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#6D72C3',
        padding: 10,
        marginLeft: 10,
        borderRadius: 4,
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
    },
    errorMessage: {
        color: 'red',
        marginBottom: 10,
    },
    boardsGrid: {
        flex: 1,
    },
    boardCard: {
        flex: 1,
        margin: 8,
        padding: 16,
        borderRadius: 8,
        minHeight: 120,
        maxWidth: '45%',
    },
    boardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    teamMembers: {
        fontSize: 14,
        marginBottom: 8,
    },
    badge: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        color: 'white',
        fontSize: 12,
    },
    badgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    noBoards: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#999',
    }
});

export default BoardsScreen;