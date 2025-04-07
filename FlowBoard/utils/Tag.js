import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addTagToTask } from '../redux/actions';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import globalStyles from '../shared/globalStyles';

const Tag = ({ isOpen, closeModal, task, taskId }) => {
  const dispatch = useDispatch();
  const [tag, setTag] = useState("");

  useEffect(() => {
    if (task) {
      setTag(task.tag || "");
    }
  }, [task]);

  useEffect(() => {
    if (isOpen) {
      setTag("");
    }
  }, [isOpen]);

  const handleSave = () => {
    if (tag.trim().length > 0) {
      const tagArray = tag.split(',').map(tag => tag.trim());
      dispatch(addTagToTask({ taskId, tag: tagArray }));
    }
    closeModal();
  };

  return (
    <Modal visible={isOpen} transparent={true} animationType="slide">
      <View style={globalStyles.modalContainer}>
        <View style={[globalStyles.modalView, { height: 250 }]}>
          <Text style={[globalStyles.headerStyle, { marginBottom: 5 }]}>Tag</Text>
          <TextInput
            style={globalStyles.inputStyle}
            value={tag}
            onChangeText={setTag}
            placeholder="Enter a tag"
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
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>Cancel</Text>
            </TouchableOpacity>

          </View>
        </View>
      </View >
    </Modal >
  );
};

export default Tag;
