import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateTaskStatus } from '../redux/actions';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import globalStyles from '../shared/globalStyles';
import { Dropdown } from 'react-native-element-dropdown';

const UpdateTaskStatus = ({ isOpen, closeModal, task, taskId }) => {

  const dispatch = useDispatch();
  const [newStatus, setNewStatus] = useState(task?.status || '');
  const [isFocus, setIsFocus] = useState(false);

  const statusOptions = [
    { label: 'To Do', value: 'to do' },
    { label: 'Doing', value: 'doing' },
    { label: 'Done', value: 'done' }
  ];

  // const handleMove = () => {
  //   if (newStatus && taskId) {
  //     dispatch(updateTaskStatus({ taskId, newStatus, updatedTask }));
  //     closeModal();
  //   } else {
  //     console.error('Invalid status or taskId');
  //   }
  // };

  const handleMove = () => {
    if (newStatus && taskId) {
      const updatedTask = { ...task, status: newStatus }; 
      dispatch(updateTaskStatus({ taskId, newStatus, updatedTask }));
      closeModal();
    } else {
      console.error('Invalid status or taskId');
    }
  };


  return (
    <Modal visible={isOpen} transparent={true} animationType='slide'>
      <View style={globalStyles.modalContainer}>
        <View style={[globalStyles.modalView, { height: 250 }]}>
          <Text style={[globalStyles.headerStyle, { marginBottom: 5 }]}>Move Tag</Text>

          <Dropdown
            style={[globalStyles.dropdown, isFocus && { borderColor: '#6200ee' }]}
            placeholderStyle={globalStyles.placeholderStyle}
            selectedTextStyle={globalStyles.selectedTextStyle}
            data={statusOptions}
            maxHeight={200}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? 'Select status' : '...'}
            value={newStatus}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setNewStatus(item.value);
              setIsFocus(false);
            }}
          />

          <View style={globalStyles.itemContainer}>
            <TouchableOpacity
              style={globalStyles.buttonStyle}
              onPress={handleMove}
            >
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>Move task</Text>
            </TouchableOpacity>
          </View>

          <View style={globalStyles.itemContainer}>
            <TouchableOpacity
              style={globalStyles.buttonStyle}
              onPress={closeModal}
            >
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>Cancel</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal >
  );
};

export default UpdateTaskStatus;