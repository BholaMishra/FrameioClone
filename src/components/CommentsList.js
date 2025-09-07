import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CommentsSection = ({
  comments,
  onSeekTo,
  currentTime,
  onAddComment,
  onReplyComment
}) => {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - commentDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment({
        text: newComment.trim(),
        timestamp: currentTime,
        user: {
          name: 'You',
          avatar: 'https://ui-avatars.com/api/?name=You&background=6366f1&color=fff',
        },
        createdAt: new Date().toISOString(),
        id: Date.now().toString(),
      });
      setNewComment('');
    }
  };

  const handleReply = (comment) => {
    if (replyText.trim()) {
      onReplyComment({
        text: replyText.trim(),
        parentId: comment.id,
        timestamp: comment.timestamp,
        user: {
          name: 'You',
          avatar: 'https://ui-avatars.com/api/?name=You&background=10b981&color=fff',
        },
        createdAt: new Date().toISOString(),
        id: Date.now().toString(),
        isReply: true,
      });
      setReplyText('');
      setReplyingTo(null);
    }
  };

  const renderComment = ({item, index}) => {
    const isAnchored = item.isAnchored;
    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.user?.name || 'User')}&background=6366f1&color=fff`;

    return (
      <View style={[styles.commentItem, item.isReply && styles.replyItem]}>
        <TouchableOpacity
          style={styles.timestampBadge}
          onPress={() => onSeekTo(item.timestamp)}>
          <Text style={styles.timestampText}>
            {formatTime(item.timestamp)}
          </Text>
          {isAnchored && (
            <View style={[styles.anchorDot, {backgroundColor: item.color}]} />
          )}
        </TouchableOpacity>

        <View style={styles.commentContent}>
          <View style={styles.commentHeader}>
            <Image
              source={{uri: item.user?.avatar || defaultAvatar}}
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.user?.name || 'Anonymous'}</Text>
              <Text style={styles.timeAgo}>{formatTimeAgo(item.createdAt)}</Text>
            </View>
            <TouchableOpacity style={styles.moreButton}>
              <Icon name="more-horiz" size={20} color="#999" />
            </TouchableOpacity>
          </View>

          <Text style={styles.commentText}>{item.text}</Text>

          <View style={styles.commentActions}>
            <TouchableOpacity
              style={styles.replyButton}
              onPress={() => setReplyingTo(replyingTo === item.id ? null : item.id)}>
              <Icon name="reply" size={16} color="#666" />
              <Text style={styles.replyButtonText}>Reply</Text>
            </TouchableOpacity>
          </View>

          {replyingTo === item.id && (
            <View style={styles.replyInput}>
              <TextInput
                style={styles.replyTextInput}
                placeholder="Write a reply..."
                value={replyText}
                onChangeText={setReplyText}
                multiline
              />
              <View style={styles.replyActions}>
                <TouchableOpacity
                  style={styles.replyCancel}
                  onPress={() => setReplyingTo(null)}>
                  <Text style={styles.replyCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.replySubmit,
                    !replyText.trim() && styles.disabledButton
                  ]}
                  onPress={() => handleReply(item)}
                  disabled={!replyText.trim()}>
                  <Text style={styles.replySubmitText}>Reply</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderCommentInput = () => (
    <View style={styles.commentInputSection}>
      <Image
        source={{uri: 'https://ui-avatars.com/api/?name=You&background=6366f1&color=fff'}}
        style={styles.inputAvatar}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Write your comment here"
          value={newComment}
          onChangeText={setNewComment}
          multiline
        />
        <View style={styles.inputActions}>
          <View style={styles.inputTools}>
            <TouchableOpacity style={styles.inputTool}>
              <Icon name="access-time" size={16} color="#666" />
              <Text style={styles.inputToolText}>{formatTime(currentTime)}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.inputTool}>
              <Icon name="edit" size={16} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.colorTool}>
              <View style={styles.redDot} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.colorTool}>
              <View style={styles.greenDot} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[
              styles.commentButton,
              !newComment.trim() && styles.disabledButton
            ]}
            onPress={handleAddComment}
            disabled={!newComment.trim()}>
            <Text style={styles.commentButtonText}>Comment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Comments</Text>
        <Text style={styles.commentCount}>{comments.length}</Text>
      </View>

      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item) => item.id}
        style={styles.commentsList}
        showsVerticalScrollIndicator={false}
      />

      {renderCommentInput()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  commentCount: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  commentsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  commentItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  replyItem: {
    marginLeft: 40,
    paddingLeft: 16,
    borderLeftWidth: 2,
    borderLeftColor: '#e0e0e0',
  },
  timestampBadge: {
    backgroundColor: '#f0f8f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  timestampText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2d5a2d',
  },
  anchorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 6,
  },
  commentContent: {
    flex: 1,
    marginLeft: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  userInfo: {
    flex: 1,
    marginLeft: 8,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  timeAgo: {
    fontSize: 12,
    color: '#999',
  },
  moreButton: {
    padding: 4,
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  replyButtonText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
  replyInput: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  replyTextInput: {
    fontSize: 14,
    color: '#333',
    minHeight: 40,
    textAlignVertical: 'top',
  },
  replyActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  replyCancel: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  replyCancelText: {
    fontSize: 14,
    color: '#666',
  },
  replySubmit: {
    backgroundColor: '#8B5A2B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  replySubmitText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  commentInputSection: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#ffffff',
  },
  inputAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginTop: 4,
  },
  inputContainer: {
    flex: 1,
    marginLeft: 12,
  },
  commentInput: {
    fontSize: 14,
    color: '#333',
    minHeight: 40,
    paddingVertical: 8,
    textAlignVertical: 'top',
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  inputTools: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputTool: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    paddingHorizontal: 6,
    paddingVertical: 4,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  inputToolText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
  colorTool: {
    marginRight: 8,
  },
  redDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ff4444',
  },
  greenDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#44ff44',
  },
  commentButton: {
    backgroundColor: '#8B5A2B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  commentButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});

export default CommentsSection;