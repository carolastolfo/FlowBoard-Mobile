import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { View, TextInput, Text, Modal, TouchableOpacity } from 'react-native';
import globalStyles from '../shared/globalStyles';
import { updateTaskDueDate } from '../redux/actions';

const DueDate = ({ isOpen, closeModal, task, taskId }) => {
  const dispatch = useDispatch();
  const [date, setDate] = useState("");

  useEffect(() => {
    if (task) {
      setDate(task.dueDate || "");
    }
  }, [task]);

  const handleSave = () => {
    console.log("Saving Due Date:", date, "for Task ID:", taskId);

    dispatch(updateTaskDueDate({ taskId, dueDate: date }));
    closeModal();
  };

  return (
    <Modal visible={isOpen} transparent={true} animationType="slide">
      <View style={globalStyles.modalContainer}>
        <View style={[globalStyles.modalView, { height: 250 }]}>
          <Text style={globalStyles.headerStyle}>Due Date</Text>

          <TextInput
            style={globalStyles.inputStyle}
            placeholder="YYYY-MM-DD"
            value={date}
            onChangeText={setDate}
            keyboardType="default"
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
      </View>
    </Modal >
  );
};

export default DueDate;
