import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJoinRequests, acceptJoin, rejectJoin } from '../redux/actions';

const BoardsManagingScreen = () => {
    const currentUserId = "TRK8Ig0TxD2Ghm9XiUsi"; // Replace with Auth user ID
    const dispatch = useDispatch();

    const boards = useSelector(state => state.boardsRoot.boards);
    const joinRequests = useSelector(state => state.boardsRoot.joinRequests);

    // Filter boards owned by current user
    const ownedBoards = boards.filter(board => board.owner_id === currentUserId);

    useEffect(() => {
        dispatch(fetchJoinRequests(currentUserId));
    }, [dispatch, currentUserId]);

    const handleAcceptJoin = (request) => {
        dispatch(acceptJoin(request));
    };

    const handleRejectJoin = (requestId) => {
        dispatch(rejectJoin(requestId));
    };

    const renderJoinRequest = (request) => {
        return (
            <View key={request.id} style={styles.requestContainer}>
            <Text>{request.username} wants to join</Text>
            <View style={styles.buttonGroup}>
                <TouchableOpacity
                    onPress={() => handleAcceptJoin(request)}
                    style={styles.acceptButton}
                >
                    <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleRejectJoin(request.id)}
                    style={styles.rejectButton}
                >
                    <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
            </View>
        </View>
        );
    };

    const renderBoardItem = ({ item }) => {
        const requestsForBoard = joinRequests.filter(r => r.boardId === item.id);
        return (
            <View style={styles.boardCard}>
                <Text style={styles.boardTitle}>{item.name}</Text>
                <Text style={styles.subtitle}>Join Requests:</Text>
                {requestsForBoard.length > 0 ? (
                    requestsForBoard.map(request => renderJoinRequest(request))
                ) : (
                    <Text style={styles.noRequests}>No join requests</Text>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {ownedBoards.length > 0 ? (
                <FlatList
                    data={ownedBoards}
                    renderItem={renderBoardItem}
                    keyExtractor={item => item.id}
                />
            ) : (
                <Text style={styles.noBoards}>You don’t own any boards.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#E5D4ED',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    boardCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    boardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    requestContainer: {
        marginBottom: 8,
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 6,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 6,
    },
    acceptButton: {
        backgroundColor: '#4a90e2',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
        marginRight: 8,
    },
    rejectButton: {
        backgroundColor: '#e94e4e',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
    },
    noRequests: {
        fontStyle: 'italic',
        color: '#777',
    },
    noBoards: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#999',
    },
});

export default BoardsManagingScreen;
