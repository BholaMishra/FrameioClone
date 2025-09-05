import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Text,
  Modal,
  Alert,
} from 'react-native';
import VideoPlayer from '../components/VideoPlayer';
import CommentsList from '../components/CommentsList';
import DrawingTool from '../components/DrawingTool';
import TimestampComment from '../components/TimestampComment';
import useComments from '../hooks/useComments';
import useDrawing from '../hooks/useDrawing';
import Icon from 'react-native-vector-icons/MaterialIcons';

const {width, height} = Dimensions.get('window');

const VideoReviewScreen = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showDrawing, setShowDrawing] = useState(false);
  const [selectedDrawingColor, setSelectedDrawingColor] = useState('#ff0000');
  
  // यह state comment button click होने पर exact time capture करने के लिए है
  const [commentTimestamp, setCommentTimestamp] = useState(0);
  
  const videoRef = useRef(null);
  const {comments, addComment, addReply} = useComments();
  const {drawings, addDrawing, clearAllDrawings} = useDrawing();

  // User profile (you can make this dynamic)
  const userProfile = {
    name: 'Bhola Reviewer',
    avatar: 'https://ui-avatars.com/api/?name=Bhola+Reviewer&background=6366f1&color=fff&size=128',
  };

  const handleAddComment = (commentData) => {
    // Comment data में सही timestamp के साथ commentTimestamp को use करें
    const updatedCommentData = {
      ...commentData,
      timestamp: commentTimestamp, // यहां commentTimestamp use करें currentTime के बजाय
    };
    addComment(updatedCommentData);
    setShowCommentModal(false);
  };

  const handleReplyComment = (replyData) => {
    addReply(replyData);
  };

  const handleSeekTo = (timestamp) => {
    if (videoRef.current) {
      videoRef.current.seek(timestamp);
      setCurrentTime(timestamp);
    }
  };

  const handleOpenCommentModal = () => {
    // Comment button पर click होने पर exact उस समय का timestamp capture करें
    setCommentTimestamp(currentTime);
    
    // अगर video चल रही है तो pause करें
    if (isPlaying) {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
    
    // Modal खोलें
    setShowCommentModal(true);
  };

  const toggleDrawingMode = () => {
    if (!showDrawing && isPlaying) {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
    setShowDrawing(!showDrawing);
  };

  const clearDrawings = () => {
    Alert.alert(
      'Clear All Drawings',
      'Are you sure you want to clear all drawings? This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Clear', style: 'destructive', onPress: clearAllDrawings},
      ]
    );
  };

  const drawingColors = [
    '#ff0000', '#00ff00', '#0000ff', '#ffff00', 
    '#ff00ff', '#00ffff', '#ffa500', '#800080',
    '#000000', '#ffffff'
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Video Section */}
      <View style={styles.videoContainer}>
        <VideoPlayer
          ref={videoRef}
          onTimeUpdate={setCurrentTime}
          onPlaybackStateChange={setIsPlaying}
        />
        
        {showDrawing && (
          <View style={styles.drawingOverlay}>
            <DrawingTool
              drawings={drawings}
              onDrawingComplete={(drawingData) => addDrawing(currentTime, drawingData.path, selectedDrawingColor)}
              selectedColor={selectedDrawingColor}
            />
          </View>
        )}
        
        {showDrawing && (
          <View style={styles.drawingIndicator}>
            <Icon name="brush" size={16} color="#ffffff" />
            <Text style={styles.drawingIndicatorText}>Drawing Mode Active</Text>
          </View>
        )}
      </View>

      {/* Controls Section */}
      <View style={styles.controlsContainer}>
        <View style={styles.mainControls}>
          <TouchableOpacity
            style={[styles.controlButton, showDrawing && styles.activeControlButton]}
            onPress={toggleDrawingMode}>
            <Icon name="brush" size={24} color={showDrawing ? '#ffffff' : '#6366f1'} />
            <Text style={[styles.controlButtonText, showDrawing && styles.activeControlButtonText]}>
              {showDrawing ? 'Stop Drawing' : 'Draw'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={handleOpenCommentModal}>
            <Icon name="comment" size={24} color="#6366f1" />
            <Text style={styles.controlButtonText}>Add Comment</Text>
          </TouchableOpacity>
        </View>

        {showDrawing && (
          <>
            <View style={styles.colorSection}>
              <Text style={styles.colorSectionTitle}>Drawing Colors:</Text>
              <View style={styles.colorPicker}>
                {drawingColors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorButton,
                      {backgroundColor: color},
                      selectedDrawingColor === color && styles.selectedColorButton,
                      color === '#ffffff' && styles.whiteColorButton,
                    ]}
                    onPress={() => setSelectedDrawingColor(color)}
                  />
                ))}
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearDrawings}>
              <Icon name="clear-all" size={20} color="#ef4444" />
              <Text style={styles.clearButtonText}>Clear All Drawings</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={styles.timeSection}>
          <Icon name="access-time" size={20} color="#6366f1" />
          <Text style={styles.currentTimeText}>
            Current Time: {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}
          </Text>
          {!isPlaying && (
            <View style={styles.pausedBadge}>
              <Icon name="pause" size={16} color="#ef4444" />
              <Text style={styles.pausedText}>Paused</Text>
            </View>
          )}
        </View>
      </View>

      {/* Comments Section */}
      <CommentsList
        comments={comments}
        onSeekTo={handleSeekTo}
        currentTime={currentTime}
        onReplyComment={handleReplyComment}
      />

      {/* Comment Modal */}
      <Modal
        visible={showCommentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCommentModal(false)}>
        <TimestampComment
          currentTime={commentTimestamp} // यहां commentTimestamp pass करें
          onSubmit={handleAddComment}
          onCancel={() => setShowCommentModal(false)}
          userProfile={userProfile}
        />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  videoContainer: {
    height: height * 0.35,
    backgroundColor: '#000000',
    position: 'relative',
  },
  drawingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  drawingIndicator: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 11,
  },
  drawingIndicatorText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  controlsContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  mainControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
controlButton: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 12,
  marginHorizontal: 1,
  borderRadius: 10,
  borderWidth: 2,
  borderColor: '#6366f1',
  backgroundColor: '#ffffff',
  elevation: 2,
  shadowColor: '#6366f1',
  shadowOffset: {width: 0, height: 2},
  shadowOpacity: 0.1,
  shadowRadius: 4,
},
  activeControlButton: {
    backgroundColor: '#6366f1',
    justifyContent:'center',
    alignItems:'center',
  },
  controlButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '600',
  },
  activeControlButtonText: {
    color: '#ffffff',
  },
  colorSection: {
    marginBottom: 16,
  },
  colorSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
  },
  colorPicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  colorButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#d1d5db',
    margin: 2,
  },
  selectedColorButton: {
    borderColor: '#374151',
    borderWidth: 4,
    elevation: 3,
  },
  whiteColorButton: {
    borderColor: '#9ca3af',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
    marginBottom: 16,
  },
  clearButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '600',
  },
  timeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  currentTimeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  pausedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#fee2e2',
    borderRadius: 12,
  },
  pausedText: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default VideoReviewScreen;