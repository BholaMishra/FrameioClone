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

const CommentsList = ({comments, onSeekTo, currentTime, onReplyComment}) => {
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const formatTimestamp = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isCurrentComment = (timestamp) => {
    return Math.abs(currentTime - timestamp) < 2;
  };

  const handleReply = (commentId) => {
    setReplyingTo(commentId);
    setReplyText('');
  };

  const submitReply = (parentCommentId, parentTimestamp) => {
    if (replyText.trim()) {
      const replyData = {
        id: Date.now().toString(),
        text: replyText.trim(),
        timestamp: parentTimestamp,
        parentCommentId: parentCommentId,
        user: {
          name: 'Current User',
          avatar: 'https://ui-avatars.com/api/?name=Current+User&background=10b981&color=fff&size=128',
        },
        createdAt: new Date().toISOString(),
        isReply: true,
      };
      
      onReplyComment(replyData);
      setReplyingTo(null);
      setReplyText('');
    }
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
  };

  const getReplies = (commentId) => {
    return comments.filter(comment => comment.parentCommentId === commentId);
  };

  const getMainComments = () => {
    return comments.filter(comment => !comment.isReply);
  };

  const renderReply = (reply) => (
    <View key={reply.id} style={styles.replyItem}>
      <View style={styles.replyLine} />
      <View style={styles.replyContent}>
        <View style={styles.commentHeader}>
          <Image 
            source={{uri: reply.user?.avatar || 'https://ui-avatars.com/api/?name=User&background=6b7280&color=fff'}} 
            style={styles.replyAvatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{reply.user?.name || 'Anonymous'}</Text>
            <Text style={styles.replyDate}>
              {new Date(reply.createdAt).toLocaleDateString()} at{' '}
              {new Date(reply.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        </View>
        <Text style={styles.replyText}>{reply.text}</Text>
      </View>
    </View>
  );

  const renderCommentItem = ({item, index}) => {
    if (item.isReply) return null; // Skip replies, they're rendered with their parent
    
    const isActive = isCurrentComment(item.timestamp);
    const replies = getReplies(item.id);
    const isReplying = replyingTo === item.id;
    
    return (
      <View style={[styles.commentContainer, isActive && styles.activeCommentContainer]}>
        <TouchableOpacity
          style={[styles.commentItem, isActive && styles.activeCommentItem]}
          onPress={() => onSeekTo(item.timestamp)}>
          
          <View style={styles.commentHeader}>
            <Image 
              source={{uri: item.user?.avatar || 'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff'}} 
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.user?.name || 'Anonymous'}</Text>
              <View style={styles.timestampContainer}>
                <Icon name="access-time" size={16} color="#6b7280" />
                <Text style={styles.timestampText}>
                  {formatTimestamp(item.timestamp)}
                </Text>
                <Text style={styles.commentIndex}>#{index + 1}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.commentText}>{item.text}</Text>
          
          <View style={styles.commentFooter}>
            <Text style={styles.commentDate}>
              {new Date(item.createdAt).toLocaleDateString()} at{' '}
              {new Date(item.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
            <TouchableOpacity 
              style={styles.replyButton}
              onPress={() => handleReply(item.id)}>
              <Icon name="reply" size={16} color="#6366f1" />
              <Text style={styles.replyButtonText}>Reply</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Render replies */}
        {replies.length > 0 && (
          <View style={styles.repliesContainer}>
            {replies.map(reply => renderReply(reply))}
          </View>
        )}

        {/* Reply input */}
        {isReplying && (
          <View style={styles.replyInputContainer}>
            <View style={styles.replyInputHeader}>
              <Text style={styles.replyInputLabel}>Replying to {item.user?.name}</Text>
              <TouchableOpacity onPress={cancelReply}>
                <Icon name="close" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.replyInput}
              placeholder="Write your reply..."
              value={replyText}
              onChangeText={setReplyText}
              multiline={true}
              numberOfLines={3}
              textAlignVertical="top"
            />
            <View style={styles.replyInputActions}>
              <TouchableOpacity
                style={styles.cancelReplyButton}
                onPress={cancelReply}>
                <Text style={styles.cancelReplyText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitReplyButton, !replyText.trim() && styles.disabledButton]}
                onPress={() => submitReply(item.id, item.timestamp)}
                disabled={!replyText.trim()}>
                <Icon name="send" size={16} color="#ffffff" />
                <Text style={styles.submitReplyText}>Reply</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="comment" size={48} color="#d1d5db" />
      <Text style={styles.emptyStateText}>No comments yet</Text>
      <Text style={styles.emptyStateSubtext}>
        Tap the comment button while watching to add your first comment
      </Text>
    </View>
  );

  const mainComments = getMainComments();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerText}>Comments ({comments.length})</Text>
          <Text style={styles.headerSubtext}>{mainComments.length} comments</Text>
        </View>
        <Icon name="chat-bubble-outline" size={20} color="#6366f1" />
      </View>
      
      <FlatList
        data={mainComments}
        renderItem={renderCommentItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={mainComments.length === 0 ? styles.emptyContainer : styles.listContent}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  headerLeft: {
    flex: 1,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
  },
  headerSubtext: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9ca3af',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#d1d5db',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  commentContainer: {
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activeCommentContainer: {
    shadowColor: '#6366f1',
    shadowOpacity: 0.3,
    elevation: 4,
  },
  commentItem: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  activeCommentItem: {
    backgroundColor: '#eff6ff',
    borderColor: '#6366f1',
    borderWidth: 2,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  replyAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestampText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366f1',
    marginLeft: 4,
    marginRight: 8,
  },
  commentIndex: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  commentText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 8,
  },
  commentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  replyButtonText: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '600',
    marginLeft: 4,
  },
  repliesContainer: {
    marginTop: 8,
    paddingLeft: 16,
  },
  replyItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  replyLine: {
    width: 2,
    backgroundColor: '#d1d5db',
    marginRight: 12,
    marginTop: 8,
  },
  replyContent: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  replyText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  replyDate: {
    fontSize: 10,
    color: '#9ca3af',
  },
  replyInputContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  replyInputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  replyInputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  replyInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    color: '#374151',
    backgroundColor: '#ffffff',
    minHeight: 60,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  replyInputActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelReplyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  cancelReplyText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  submitReplyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#6366f1',
    borderRadius: 6,
  },
  disabledButton: {
    backgroundColor: '#d1d5db',
  },
  submitReplyText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default CommentsList;