import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COMMENTS_STORAGE_KEY = '@frameio_comments';
const ANCHORED_COMMENTS_STORAGE_KEY = '@frameio_anchored_comments';

const useComments = () => {
  const [comments, setComments] = useState([]);
  const [anchoredComments, setAnchoredComments] = useState([]);

  // Load comments from storage on mount
  useEffect(() => {
    loadComments();
    loadAnchoredComments();
  }, []);

  const loadComments = async () => {
    try {
      const storedComments = await AsyncStorage.getItem(COMMENTS_STORAGE_KEY);
      if (storedComments) {
        const parsedComments = JSON.parse(storedComments);
        setComments(parsedComments.sort((a, b) => a.timestamp - b.timestamp));
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const loadAnchoredComments = async () => {
    try {
      const storedAnchored = await AsyncStorage.getItem(ANCHORED_COMMENTS_STORAGE_KEY);
      if (storedAnchored) {
        const parsedAnchored = JSON.parse(storedAnchored);
        setAnchoredComments(parsedAnchored);
      }
    } catch (error) {
      console.error('Error loading anchored comments:', error);
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

  const saveAnchoredComments = async (anchoredToSave) => {
    try {
      await AsyncStorage.setItem(
        ANCHORED_COMMENTS_STORAGE_KEY,
        JSON.stringify(anchoredToSave)
      );
    } catch (error) {
      console.error('Error saving anchored comments:', error);
    }
  };

  const addComment = (commentData) => {
    const newComment = {
      id: Date.now().toString(),
      timestamp: Math.round(commentData.timestamp),
      text: commentData.text,
      user: commentData.user,
      createdAt: new Date().toISOString(),
      isAnchored: commentData.isAnchored || false,
      x: commentData.x,
      y: commentData.y,
      color: commentData.color,
    };

    const updatedComments = [...comments, newComment].sort(
      (a, b) => a.timestamp - b.timestamp
    );

    setComments(updatedComments);
    saveComments(updatedComments);

    // If it's an anchored comment, also add to anchored comments
    if (commentData.isAnchored) {
      const updatedAnchored = [...anchoredComments, newComment];
      setAnchoredComments(updatedAnchored);
      saveAnchoredComments(updatedAnchored);
    }
  };

  const addReply = (replyData) => {
    const newReply = {
      id: Date.now().toString(),
      timestamp: Math.round(replyData.timestamp),
      text: replyData.text,
      user: replyData.user,
      createdAt: new Date().toISOString(),
      isReply: true,
      parentId: replyData.parentId,
    };

    const updatedComments = [...comments, newReply].sort(
      (a, b) => a.timestamp - b.timestamp
    );

    setComments(updatedComments);
    saveComments(updatedComments);
  };

  const removeComment = (commentId) => {
    const updatedComments = comments.filter(comment => comment.id !== commentId);
    setComments(updatedComments);
    saveComments(updatedComments);

    // Also remove from anchored if it exists
    const updatedAnchored = anchoredComments.filter(comment => comment.id !== commentId);
    setAnchoredComments(updatedAnchored);
    saveAnchoredComments(updatedAnchored);
  };

  const clearAllComments = () => {
    setComments([]);
    setAnchoredComments([]);
    AsyncStorage.removeItem(COMMENTS_STORAGE_KEY);
    AsyncStorage.removeItem(ANCHORED_COMMENTS_STORAGE_KEY);
  };

  const getCommentsForTimestamp = (timestamp, tolerance = 2) => {
    return comments.filter(
      comment => Math.abs(comment.timestamp - timestamp) <= tolerance
    );
  };

  const getAnchoredCommentsForTimestamp = (timestamp, tolerance = 2) => {
    return anchoredComments.filter(
      comment => Math.abs(comment.timestamp - timestamp) <= tolerance
    );
  };

  return {
    comments,
    anchoredComments,
    addComment,
    addReply,
    removeComment,
    clearAllComments,
    getCommentsForTimestamp,
    getAnchoredCommentsForTimestamp,
    reloadComments: loadComments,
  };
};

export default useComments;