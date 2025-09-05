import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TimestampComment = ({currentTime, onSubmit, onCancel, userProfile}) => {
  const [commentText, setCommentText] = useState('');

  const formatTimestamp = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    if (commentText.trim()) {
      const commentData = {
        text: commentText.trim(),
        timestamp: currentTime,
        user: userProfile || {
          name: 'Anonymous User',
          avatar: null,
        },
        createdAt: new Date().toISOString(),
        id: Date.now().toString(),
      };
      onSubmit(commentData);
      setCommentText('');
    }
  };

  const defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff';

  return (
    <View style={styles.overlay}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <Image 
                source={{uri: userProfile?.avatar || defaultAvatar}} 
                style={styles.avatar}
              />
              <View>
                <Text style={styles.userName}>
                  {userProfile?.name || 'Anonymous User'}
                </Text>
                <Text style={styles.commentLabel}>Adding comment</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
              <Icon name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.timestampInfo}>
            <Icon name="access-time" size={20} color="#6366f1" />
            <Text style={styles.timestampText}>
              At {formatTimestamp(currentTime)}
            </Text>
            <View style={styles.pausedIndicator}>
              <Icon name="pause" size={16} color="#ef4444" />
              <Text style={styles.pausedText}>Video Paused</Text>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="What's your feedback at this moment?"
              placeholderTextColor="#9ca3af"
              value={commentText}
              onChangeText={setCommentText}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
              autoFocus={true}
            />
            <Text style={styles.characterCount}>
              {commentText.length}/500
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.submitButton,
                !commentText.trim() && styles.disabledButton,
              ]}
              onPress={handleSubmit}
              disabled={!commentText.trim()}>
              <Icon name="send" size={18} color="#ffffff" />
              <Text style={styles.submitButtonText}>Post Comment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '95%',
    maxWidth: 450,
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  commentLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
  },
  timestampInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  timestampText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#6366f1',
    flex: 1,
  },
  pausedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  pausedText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#374151',
    backgroundColor: '#f9fafb',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 8,
  },
buttonContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
},

cancelButton: {
  flex: 0.8,
  paddingVertical: 14,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#d1d5db',
  backgroundColor: '#ffffff',
  marginRight: 8,
  alignItems: 'center',
  justifyContent: 'center',
},

cancelButtonText: {
  fontSize: 16,
  fontWeight: '600',
  color: '#6b7280',
},

submitButton: {
  flex: 1.5,
  paddingVertical: 14,
  borderRadius: 8,
  backgroundColor: '#6366f1',
  marginLeft: 8,
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'center',
},

disabledButton: {
  backgroundColor: '#d1d5db',
},

submitButtonText: {
  fontSize: 16,
  fontWeight: '600',
  color: '#ffffff',
  marginLeft: 6,
},

});

export default TimestampComment;