import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { editTask } from '../redux/actions';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import globalStyles from '../shared/globalStyles';

const EditTaskModal = ({ isOpen, closeModal, task }) => {
  const dispatch = useDispatch();
  const [taskName, setTaskName] = useState(task?.name || '');

  useEffect(() => {
    if (task) {
      setTaskName(task.name);
    }
  }, [task]);

  const handleSave = () => {
    dispatch(editTask({ ...task, name: taskName }));
    closeModal();
  };

  return (
    <Modal visible={isOpen} transparent={true} animationType="slide">
      <View style={globalStyles.modalContainer}>
        <View style={[globalStyles.modalView, { height: 250 }]}>
          <Text style={[globalStyles.headerStyle, { marginBottom: 5 }]}> Edit Task</Text>
          <TextInput
            style={globalStyles.inputStyle}
            value={taskName}
            onChangeText={setTaskName}
          />
          <View style={globalStyles.itemContainer}>
            <TouchableOpacity
              style={globalStyles.buttonStyle}
              onPress={handleSave}
            >
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>Save</Text>
            </TouchableOpacity>
          </View>
          <View style={globalStyles.itemContainer}>
            <TouchableOpacity
              style={globalStyles.buttonStyle}
              onPress={closeModal}
            >
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}> Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View >
    </Modal >
  );
};

export default EditTaskModal;
