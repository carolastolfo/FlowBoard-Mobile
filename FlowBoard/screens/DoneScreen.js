import globalStyles from "../shared/globalStyles";
import Icon from 'react-native-vector-icons/FontAwesome'
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal } from "react-native";

const DoneScreen = () => {
  const [tasks, setTasks] = useState([
    { id: "1", text: "UI/UX Design & Wireframing", completed: false },
    { id: "2", text: "Responsive & Visual Design", completed: false },
    { id: "3", text: "Website Testing & Optimization", completed: false },
  ]);

  const [newTask, setNewTask] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const addTask = () => {
    if (newTask.trim() === "") return;
    const newTaskObj = { id: Date.now().toString(), text: newTask, completed: false };
    setTasks([...tasks, newTaskObj]);
    setNewTask("");
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <View style={globalStyles.container}>

      <View style={globalStyles.inputContainer}>
        <TextInput
          style={globalStyles.inputStyle}
          placeholder="Add a new task..."
          value={newTask}
          keyboardType='name-phone-pad'
          onChangeText={setNewTask}
          maxLength={100}
        />

        <TouchableOpacity style={globalStyles.addButton} onPress={addTask}>
          <Icon name='plus' color='white' size={20} />
        </TouchableOpacity>
      </View>

      <View style={globalStyles.taskContainer}>
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={globalStyles.taskContainerItem}>

              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() => {
                  setSelectedTaskId(item.id)
                  setShowModal(!showModal)
                }}
              >
                <Icon name='bars' color='gray' size={25} />
              </TouchableOpacity>

              <TextInput
                style={[globalStyles.taskContainerContent,
                item.completed && globalStyles.completedTask
                ]}
                value={item.text}
                editable={true}
                maxLength={100}
                multiline={true}
                onChangeText={(newText) => {
                  setTasks(tasks.map(task =>
                    task.id === item.id ? { ...task, text: newText } : task
                  ));
                }}
              />

            </View>
          )}
        />
      </View>

      <Modal visible={showModal} transparent={true}>
        <View style={globalStyles.modalContainer}>
          <View style={globalStyles.modalView}>
            <View style={globalStyles.buttonContainer}>
              <TouchableOpacity
                onPress={() => {
                  toggleTask(selectedTaskId)
                  setShowModal(!showModal)
                }}
              >
                <Icon name='check-circle'
                  size={25}
                  color={
                    tasks.find(task => task.id === selectedTaskId)?.completed
                      ? "#30FF01"
                      : "white"
                  }
                />
              </TouchableOpacity>
              <Text style={globalStyles.textBtn}>
                {tasks.find(task => task.id === selectedTaskId)?.completed ? "Task Incomplete" : "Task Completed"}
              </Text>
            </View>

            <View style={globalStyles.separator}></View>

            <View style={globalStyles.buttonContainer}>
              <TouchableOpacity
                onPress={() => {
                  deleteTask(selectedTaskId)
                  setShowModal(!showModal)
                }}
              >
                <Icon name='minus-circle' color='white' size={25} />
              </TouchableOpacity>
              <Text style={globalStyles.textBtn}>Delete task</Text>
            </View>

            <View style={globalStyles.separator}></View>

            <View style={globalStyles.buttonContainer}>
              <TouchableOpacity
                onPress={() => {
                  setShowModal(!showModal)
                }}
              >
                <Icon name='times-circle' color='white' size={25} />
              </TouchableOpacity>
              <Text style={globalStyles.textBtn}>Close the popup</Text>
            </View>

          </View>
        </View>
      </Modal >

    </View >
  )
}

export default DoneScreen;