import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const {width} = Dimensions.get('window');

const AnchoredCommentModal = ({
  visible,
  onClose,
  onSubmit,
  position,
  timestamp,
  userProfile
}) => {
  const [commentText, setCommentText] = useState('');
  const [selectedColor, setSelectedColor] = useState('#ff4444');

  const colors = ['#ff4444', '#44ff44', '#4444ff', '#ffff44', '#ff44ff'];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    if (commentText.trim()) {
      onSubmit({
        text: commentText.trim(),
        timestamp: timestamp,
        x: position?.x || 0,
        y: position?.y || 0,
        color: selectedColor,
        user: userProfile || {
          name: 'Anonymous User',
          avatar: null,
        },
        createdAt: new Date().toISOString(),
        id: Date.now().toString(),
        isAnchored: true,
      });
      setCommentText('');
      onClose();
    }
  };

  const modalStyle = {
    ...styles.modal,
    left: Math.min(position?.x || 0, width - 300),
    top: Math.min(position?.y || 100, 400),
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={modalStyle}>
          {/* Arrow pointing to the anchored position */}
          <View style={styles.arrow} />
          
          <View style={styles.header}>
            <Text style={styles.timestamp}>
              {formatTime(timestamp || 0)}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Add your comment..."
            value={commentText}
            onChangeText={setCommentText}
            multiline
            autoFocus
          />

          <View style={styles.colorPicker}>
            {colors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorButton,
                  {backgroundColor: color},
                  selectedColor === color && styles.selectedColor
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.submitButton,
                !commentText.trim() && styles.disabledButton
              ]}
              onPress={handleSubmit}
              disabled={!commentText.trim()}>
              <Text style={styles.submitText}>Comment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    position: 'absolute',
    width: 280,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  arrow: {
    position: 'absolute',
    top: -8,
    left: 20,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timestamp: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  colorPicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  colorButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#333',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 10,
    marginRight: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
  },
  submitButton: {
    flex: 1,
    paddingVertical: 10,
    marginLeft: 8,
    alignItems: 'center',
    backgroundColor: '#8B5A2B',
    borderRadius: 6,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  cancelText: {
    color: '#666',
    fontWeight: '500',
  },
  submitText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default AnchoredCommentModal;