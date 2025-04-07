import { useState, useEffect } from 'react';
import { View, TextInput, Text, Modal, FlatList, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTasks, toggleCompletionStatus } from '../redux/actions';
import globalStyles from '../shared/globalStyles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { handleAddTask } from '../utils/addTask';
import { handleDelete } from '../utils/deleteTask';
import UpdateTaskStatus from '../utils/UpdateTaskStatus';
import EditTaskModal from '../utils/EditTaskModal';
import DueDate from '../utils/DueDate';
import Tag from '../utils/Tag';
import { handleDeleteTag } from '../utils/deleteTag';

const TodoScreen = ({ navigation, route }) => {

  const { boardId } = route.params;

  const dispatch = useDispatch();
  const [newTask, setNewTask] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const currentScreen = navigation.getState().routes[navigation.getState().index].name;

  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [isDueDateModalOpen, setIsDueDateModalOpen] = useState(false);
  const [isTagOpen, setIsTagOpen] = useState(false);
  const [isMoveOpen, setIsMoveOpen] = useState(false);

  const openEditTaskModal = () => setIsEditTaskModalOpen(true);
  const closeEditTaskModal = () => setIsEditTaskModalOpen(false);

  const openDueDateModal = () => setIsDueDateModalOpen(true);
  const closeDueDateModal = () => setIsDueDateModalOpen(false);

  const openTagModal = () => setIsTagOpen(true);
  const closeTagModal = () => setIsTagOpen(false);

  const openMoveModal = () => setIsMoveOpen(true);
  const closeMoveModal = () => setIsMoveOpen(false);

  const tagColors = ["#EB1660", "#4F9D69", "#E28413"];

  useEffect(() => {
    const taskListener = dispatch(fetchTasks())

    return () => taskListener
  }, [dispatch]);

  // const taskList = useSelector((state) =>
  //   state.kanbantasks.listOfTasks ? state.kanbantasks.listOfTasks.filter(task => task.status === 'to-do') : []
  // );

  const taskList = useSelector((state) =>
    state.kanbantasks.listOfTasks
      ? state.kanbantasks.listOfTasks.filter(
        task => task.boardId === boardId && task.status === currentScreen.toLowerCase()
      )
      : []
  );

  const handleStatusChange = () => {
    const updatedStatus = currentScreen === 'to-do' ? 'doing' : currentScreen === 'doing' ? 'done' : 'to-do';
    dispatch(toggleCompletionStatus(selectedTaskId, updatedStatus));
  };

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.inputContainer}>
        <TextInput
          style={globalStyles.inputAddTAsk}
          placeholder="Add a new task..."
          autoCapitalize='sentences'
          value={newTask}
          keyboardType='name-phone-pad'
          onChangeText={setNewTask}
          maxLength={100}
        />

        <TouchableOpacity style={globalStyles.addButton} onPress={() => {
          if (newTask.trim()) {
            handleAddTask(dispatch, newTask, boardId, currentScreen.toLowerCase());
            setNewTask("");
          }
        }}
        >
          <Icon name='plus' color='white' size={20} />
        </TouchableOpacity>
      </View>

      <View style={globalStyles.taskContainer}>
        {
          (taskList && (taskList.length > 0)) ? (
            <FlatList
              data={taskList}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (

                <View style={globalStyles.taskContainerItem}>
                  <TouchableOpacity
                    style={{ marginRight: 10 }}
                    onPress={() => {
                      setSelectedTaskId(item.id);
                      setShowModal(!showModal);
                    }}
                  >
                    <Icon name="bars" color="gray" size={25} />
                  </TouchableOpacity>

                  <View style={{ gap: 10 }}>
                    <Text style={globalStyles.taskText}>{item.name}</Text>

                    {item.tag && item.tag.length > 0 && (
                      <View style={globalStyles.tagContainer}>
                        {item.tag.map((tag, index) => (
                          <TouchableOpacity
                            key={index}
                            onPress={() => {
                              console.log('Deleting tag:', tag, 'for taskId:', item.id);
                              handleDeleteTag(dispatch, item.id, tag);
                            }}
                            style={[{ backgroundColor: tagColors[index % tagColors.length] }, globalStyles.tagStyle]}
                          >
                            <Text style={globalStyles.tagText}>{tag}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              )}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Text>No tasks in the list yet</Text>
          )
        }
      </View>

      <Modal visible={showModal} transparent={true} animationType='fade'>
        <View style={globalStyles.modalContainer}>
          <View style={[globalStyles.modalView, { height: 450 }]}>

            <Text style={globalStyles.headerStyle}>Status: {currentScreen.toUpperCase()}</Text>

            <Text>
              Due Date: {taskList?.length > 0
                ? taskList.find(task => task.id === selectedTaskId)?.dueDate || "No Due Date"
                : "No Due Date"}
            </Text>

            <View style={globalStyles.itemContainer}>
              <TouchableOpacity
                onPress={() => {
                  setShowModal(!showModal)
                }}
                style={globalStyles.buttonContainer}
              >
                <View style={globalStyles.itemContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      handleStatusChange(selectedTaskId);
                      setShowModal(!showModal);
                    }}
                    style={globalStyles.buttonContainer}
                  >
                    <View style={globalStyles.contentContainer}>
                      <Icon
                        name='check-circle'
                        size={25}
                        color={
                          taskList.find(task => task.id === selectedTaskId)?.completed
                            ? "#30FF01"
                            : "white"
                        }
                      />
                      <Text style={globalStyles.textContent}>{taskList.find(task => task.id === selectedTaskId)?.completed
                        ? 'Mark as Incomplete'
                        : 'Mark as Completed'}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>

            <View style={globalStyles.itemContainer}>
              <TouchableOpacity
                onPress={() => {
                  setShowModal(!showModal)
                  openEditTaskModal();
                }
                }
                style={globalStyles.buttonContainer}
              >

                <View style={globalStyles.contentContainer}>
                  <Icon name='plus-circle' color='white' size={25} />
                  <Text style={globalStyles.textContent}>Edit task</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={globalStyles.itemContainer}>
              <TouchableOpacity
                onPress={() => {
                  setShowModal(!showModal)
                  handleDelete(dispatch, selectedTaskId)
                }}
                style={globalStyles.buttonContainer}
              >
                <View style={globalStyles.contentContainer}>
                  <Icon name='minus-circle' color='white' size={25} />
                  <Text style={globalStyles.textContent}>Delete task</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={globalStyles.itemContainer}>
              <TouchableOpacity
                onPress={() => {
                  setShowModal(!showModal)
                  openDueDateModal();
                }}
                style={globalStyles.buttonContainer}
              >
                <View style={globalStyles.contentContainer}>
                  <Icon name='calendar-check-o' color='white' size={25} />
                  <Text style={globalStyles.textContent}>Due Date</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={globalStyles.itemContainer}>
              <TouchableOpacity
                onPress={() => {
                  setShowModal(!showModal)
                  openTagModal();
                }}
                style={globalStyles.buttonContainer}
              >
                <View style={globalStyles.contentContainer}>
                  <Icon name='gg-circle' color='white' size={25} />
                  <Text style={globalStyles.textContent}>Tag</Text>
                </View>
              </TouchableOpacity>
            </View>


            <View style={globalStyles.itemContainer}>
              <TouchableOpacity
                onPress={() => {
                  setShowModal(!showModal)
                  openMoveModal();
                }}
                style={globalStyles.buttonContainer}
              >
                <View style={globalStyles.contentContainer}>
                  <Icon name='arrow-circle-left' color='white' size={25} />
                  <Text style={globalStyles.textContent}>Move task</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={globalStyles.itemContainer}>
              <TouchableOpacity
                onPress={() => {
                  setShowModal(!showModal)
                }}
                style={globalStyles.buttonContainer}
              >
                <View style={globalStyles.contentContainer}>
                  <Icon name='times-circle' color='white' size={25} />
                  <Text style={globalStyles.textContent}>Close the popup</Text>
                </View>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal >

      <EditTaskModal
        isOpen={isEditTaskModalOpen}
        closeModal={closeEditTaskModal}
        task={taskList.find((task) => task.id === selectedTaskId)}
      />

      <DueDate
        isOpen={isDueDateModalOpen}
        closeModal={closeDueDateModal}
        // task={taskList.find((task) => task.id === selectedTaskId)}
        task={taskList.find(task => task.id === selectedTaskId)}
        taskId={selectedTaskId}
      />

      <Tag
        isOpen={isTagOpen}
        closeModal={closeTagModal}
        task={taskList.find(task => task.id === selectedTaskId)}
        taskId={selectedTaskId}
      />

      <UpdateTaskStatus
        isOpen={isMoveOpen}
        closeModal={closeMoveModal}
        task={taskList.find(task => task.id === selectedTaskId)}
        taskId={selectedTaskId}
      />

    </View >
  )
};

export default TodoScreen;
