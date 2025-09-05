import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COMMENTS_STORAGE_KEY = '@frameio_comments';

const useComments = () => {
  const [comments, setComments] = useState([]);

  // Load comments from storage on mount
  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      const storedComments = await AsyncStorage.getItem(COMMENTS_STORAGE_KEY);
      if (storedComments) {
        const parsedComments = JSON.parse(storedComments);
        // Sort by timestamp and then by creation date
        const sortedComments = parsedComments.sort((a, b) => {
          if (a.timestamp !== b.timestamp) {
            return a.timestamp - b.timestamp;
          }
          return new Date(a.createdAt) - new Date(b.createdAt);
        });
        setComments(sortedComments);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const saveComments = async (commentsToSave) => {
    try {
      await AsyncStorage.setItem(
        COMMENTS_STORAGE_KEY,
        JSON.stringify(commentsToSave)
      );
    } catch (error) {
      console.error('Error saving comments:', error);
    }
  };

  const addComment = (commentData) => {
    const newComment = {
      id: commentData.id || Date.now().toString(),
      timestamp: Math.round(commentData.timestamp),
      text: commentData.text,
      user: commentData.user || {
        name: 'Anonymous User',
        avatar: null,
      },
      createdAt: commentData.createdAt || new Date().toISOString(),
      isReply: false,
    };

    const updatedComments = [...comments, newComment].sort((a, b) => {
      if (a.timestamp !== b.timestamp) {
        return a.timestamp - b.timestamp;
      }
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

    setComments(updatedComments);
    saveComments(updatedComments);
  };

  const addReply = (replyData) => {
    const newReply = {
      id: replyData.id || Date.now().toString(),
      timestamp: Math.round(replyData.timestamp),
      text: replyData.text,
      user: replyData.user || {
        name: 'Anonymous User',
        avatar: null,
      },
      createdAt: replyData.createdAt || new Date().toISOString(),
      isReply: true,
      parentCommentId: replyData.parentCommentId,
    };

    const updatedComments = [...comments, newReply].sort((a, b) => {
      if (a.timestamp !== b.timestamp) {
        return a.timestamp - b.timestamp;
      }
      // If timestamps are equal, show parent comments before replies
      if (a.isReply !== b.isReply) {
        return a.isReply ? 1 : -1;
      }
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

    setComments(updatedComments);
    saveComments(updatedComments);
  };

  const removeComment = (commentId) => {
    // Remove comment and all its replies
    const updatedComments = comments.filter(
      comment => comment.id !== commentId && comment.parentCommentId !== commentId
    );
    setComments(updatedComments);
    saveComments(updatedComments);
  };

  const removeReply = (replyId) => {
    const updatedComments = comments.filter(comment => comment.id !== replyId);
    setComments(updatedComments);
    saveComments(updatedComments);
  };

  const clearAllComments = () => {
    setComments([]);
    AsyncStorage.removeItem(COMMENTS_STORAGE_KEY);
  };

  const getCommentsForTimestamp = (timestamp, tolerance = 2) => {
    return comments.filter(
      comment => Math.abs(comment.timestamp - timestamp) <= tolerance
    );
  };

  const getRepliesForComment = (commentId) => {
    return comments.filter(
      comment => comment.parentCommentId === commentId
    );
  };

  const getCommentWithReplies = (commentId) => {
    const comment = comments.find(c => c.id === commentId);
    const replies = getRepliesForComment(commentId);
    return {
      comment,
      replies,
    };
  };

  const updateComment = (commentId, updates) => {
    const updatedComments = comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, ...updates, updatedAt: new Date().toISOString() }
        : comment
    );
    setComments(updatedComments);
    saveComments(updatedComments);
  };

  // Statistics
  const getCommentsStats = () => {
    const totalComments = comments.filter(c => !c.isReply).length;
    const totalReplies = comments.filter(c => c.isReply).length;
    const uniqueTimestamps = new Set(comments.map(c => Math.floor(c.timestamp))).size;
    
    return {
      totalComments,
      totalReplies,
      totalInteractions: totalComments + totalReplies,
      uniqueTimestamps,
    };
  };

  return {
    comments,
    addComment,
    addReply,
    removeComment,
    removeReply,
    updateComment,
    clearAllComments,
    getCommentsForTimestamp,
    getRepliesForComment,
    getCommentWithReplies,
    getCommentsStats,
    reloadComments: loadComments,
  };
};

export default useComments;