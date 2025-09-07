import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  StatusBar,
} from 'react-native';
import VideoPlayer from '../components/VideoPlayer';
import CommentsSection from '../components/CommentsList';
import AnchoredCommentModal from '../components/AnchoredCommentModal';
import useComments from '../hooks/useComments';

const {width, height} = Dimensions.get('window');

const VideoReviewScreen = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [anchoredCommentModal, setAnchoredCommentModal] = useState({
    visible: false,
    position: null,
    timestamp: 0,
  });

  const videoRef = useRef(null);
  const {comments, addComment, addReply, anchoredComments} = useComments();

  const userProfile = {
    name: 'Noah Green',
    avatar: 'https://ui-avatars.com/api/?name=Noah+Green&background=6366f1&color=fff',
  };

  const handleTimeUpdate = (time) => {
    setCurrentTime(time);
  };

  const handlePlaybackStateChange = (isPaused) => {
    setIsPlaying(!isPaused);
  };

  const handleAddComment = (commentData) => {
    addComment({
      ...commentData,
      user: userProfile,
    });
  };

  const handleAddReply = (replyData) => {
    addReply({
      ...replyData,
      user: userProfile,
    });
  };

  const handleSeekTo = (timestamp) => {
    if (videoRef.current) {
      videoRef.current.seek(timestamp);
      setCurrentTime(timestamp);
    }
  };

  const handleVideoPause = (timestamp) => {
    setCurrentTime(timestamp);
  };

  const handleAnchoredComment = (data) => {
    setAnchoredCommentModal({
      visible: true,
      position: {x: data.x, y: data.y},
      timestamp: data.timestamp,
    });
  };

  const handleAnchoredCommentSubmit = (commentData) => {
    addComment({
      ...commentData,
      isAnchored: true,
    });
  };

  const handleCloseAnchoredModal = () => {
    setAnchoredCommentModal({
      visible: false,
      position: null,
      timestamp: 0,
    });
  };

  const showCommentModal = (comment) => {
    console.log('Show comment modal for:', comment);
    // You can implement comment details modal here
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <SafeAreaView style={styles.container}>
        <View style={styles.videoContainer}>
          <VideoPlayer
            ref={videoRef}
            onTimeUpdate={handleTimeUpdate}
            onPlaybackStateChange={handlePlaybackStateChange}
            onVideoPause={handleVideoPause}
            onAnchoredComment={handleAnchoredComment}
            anchoredComments={anchoredComments}
            showCommentModal={showCommentModal}
          />
        </View>

        <View style={styles.commentsContainer}>
          <CommentsSection
            comments={comments}
            onSeekTo={handleSeekTo}
            currentTime={currentTime}
            onAddComment={handleAddComment}
            onReplyComment={handleAddReply}
          />
        </View>

        <AnchoredCommentModal
          visible={anchoredCommentModal.visible}
          onClose={handleCloseAnchoredModal}
          onSubmit={handleAnchoredCommentSubmit}
          position={anchoredCommentModal.position}
          timestamp={anchoredCommentModal.timestamp}
          userProfile={userProfile}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  videoContainer: {
    height: height * 0.5, // Increased height for better visibility
    backgroundColor: '#000000',
  },
  commentsContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default VideoReviewScreen;