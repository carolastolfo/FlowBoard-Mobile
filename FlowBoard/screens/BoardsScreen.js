import { useDispatch, useSelector } from 'react-redux';
import { data } from '../data/data';
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { searchBoard, setBoards } from '../redux/actions'

const BoardsScreen = () => {
    const currentUserId = 1; // Should be replaced after making Auth features
    const currentUser = data.users.find(user => user.id === currentUserId);
    const dispatch = useDispatch();

    const [boardId, setBoardId] = useState("");
    const boards = useSelector(state => state.boardsRoot.boards);
    const error = useSelector(state => state.boardsRoot.error);
    
    useEffect(() => {
        dispatch(setBoards(currentUserId));
    }, [dispatch]);
    
    const handleSearch = () => {
        dispatch(searchBoard(boardId, currentUserId));
    };
    
    const handleReset = () => {
        setBoardId("");
        dispatch(setBoards(currentUserId));
    };


    // To redirect to board
    const handleRedirect = (boardId) => {
        setTimeout(() => {
            console.log("Navigating to board:", boardId);
            // inside a board's scree, todoScreen is the first screen by default
            // navigation.navigate("TodoScreen", { boardId });
        }, 1000);
    };

    const renderBoardItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.boardCard, { backgroundColor: item.background_color }]}
            onPress={() => handleRedirect(item.id)}
        >
            <Text style={styles.boardTitle}>{item.name}</Text>
            <Text style={styles.teamMembers}>Team Members: {item.team_members.length}</Text>
            {item.owner_id === currentUserId &&
                <Text style={styles.ownerBadge}>Owner</Text>
            }
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>{currentUser ? currentUser.username + "'s" : "My"} Boards</Text>
                <View style={styles.searchContainer}>
                    <TextInput
                        placeholder="Search by Board ID"
                        style={styles.searchInput}
                        value={boardId}
                        onChangeText={setBoardId}
                        keyboardType="numeric"
                    />
                    <TouchableOpacity onPress={handleSearch} style={styles.button}>
                        <Text style={styles.buttonText}>Search</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
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
        backgroundColor: '#4a90e2',
        padding: 10,
        marginLeft: 10,
        borderRadius: 4,
        justifyContent: 'center',
    },
    resetButton: {
        backgroundColor: '#9c9c9c',
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
    ownerBadge: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        color: 'white',
        fontSize: 12,
    },
    noBoards: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#999',
    }
});

export default BoardsScreen;