import React, { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
  PanResponder,
  Dimensions,
} from 'react-native';
import Video from 'react-native-video';
import {
  Play,
  Pause,
  Volume2,
  Maximize,
  MapPin,
  MessageCircle,
  Send,
  MoreHorizontal,
  Clock,
  SkipBack,
  SkipForward,
  Rewind,
  FastForward,
} from 'lucide-react-native';
import Slider from '@react-native-community/slider';

const { width: screenWidth } = Dimensions.get('window');
const SEEK_SENSITIVITY = 0.3; // Increased sensitivity for better control

const VideoPlayer = forwardRef(({ 
  onTimeUpdate, 
  onPlaybackStateChange, 
  onVideoPause, 
  onAnchoredComment, 
  anchoredComments,
  showCommentModal 
}, ref) => {
  const videoRef = useRef(null);
  const [paused, setPaused] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showControls, setShowControls] = useState(true);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekTime, setSeekTime] = useState(0);
  const [seekDirection, setSeekDirection] = useState('');

  const controlsOpacity = useRef(new Animated.Value(1)).current;
  const seekIndicatorOpacity = useRef(new Animated.Value(0)).current;

  // Sample Nike advertisement video
  const videoSource = {
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  };

  useImperativeHandle(ref, () => ({
    seek: (time) => {
      if (videoRef.current) {
        videoRef.current.seek(time);
        setCurrentTime(time);
      }
    },
    getCurrentTime: () => currentTime,
    play: () => setPaused(false),
    pause: () => setPaused(true),
  }));

  // Auto-hide controls after 3 seconds
  useEffect(() => {
    if (showControls && !paused) {
      const timer = setTimeout(() => {
        hideControls();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showControls, paused]);

  const showControlsWithFade = () => {
    setShowControls(true);
    Animated.timing(controlsOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideControls = () => {
    Animated.timing(controlsOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowControls(false);
    });
  };

  const showSeekIndicator = (direction, time) => {
    setSeekDirection(direction);
    setSeekTime(time);
    Animated.timing(seekIndicatorOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const hideSeekIndicator = () => {
    Animated.timing(seekIndicatorOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Pan Responder for slide navigation
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only respond to horizontal gestures
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
      },
      onPanResponderGrant: (evt, gestureState) => {
        setIsSeeking(true);
        showControlsWithFade();
      },
      onPanResponderMove: (evt, gestureState) => {
        const { dx } = gestureState;
        const seekAmount = (dx / screenWidth) * 60; // 60 seconds for full screen width
        const newTime = Math.max(0, Math.min(duration, currentTime + seekAmount));
        
        const direction = dx > 0 ? 'forward' : 'backward';
        showSeekIndicator(direction, newTime);
      },
      onPanResponderRelease: (evt, gestureState) => {
        const { dx } = gestureState;
        
        if (Math.abs(dx) > 20) { // Minimum threshold for seeking
          const seekAmount = (dx / screenWidth) * 60;
          const newTime = Math.max(0, Math.min(duration, currentTime + seekAmount));
          
          if (videoRef.current) {
            videoRef.current.seek(newTime);
            setCurrentTime(newTime);
            onTimeUpdate?.(newTime);
          }
        }
        
        setIsSeeking(false);
        hideSeekIndicator();
      },
      onPanResponderTerminate: () => {
        setIsSeeking(false);
        hideSeekIndicator();
      },
    })
  ).current;

  const togglePlayPause = useCallback(() => {
    const newPausedState = !paused;
    setPaused(newPausedState);
    onPlaybackStateChange?.(newPausedState);
    
    if (newPausedState) {
      onVideoPause?.(currentTime);
      showControlsWithFade();
    }
  }, [paused, currentTime, onPlaybackStateChange, onVideoPause]);

  const handleProgress = (data) => {
    if (!isSeeking) {
      setCurrentTime(data.currentTime);
      onTimeUpdate?.(data.currentTime);
    }
  };

  const handleLoad = (data) => {
    setDuration(data.duration);
    setLoading(false);
    setError(null);
    console.log('Video loaded successfully:', data);
  };

  const handleError = (error) => {
    console.error('Video error:', error);
    setError(error);
    setLoading(false);
    Alert.alert('Video Error', 'Failed to load video. Please try again.');
  };

  const handleLoadStart = () => {
    setLoading(true);
    setError(null);
    console.log('Video loading started...');
  };

  const handleVideoTap = (event) => {
    if (isSeeking) return;
    
    const { locationX, locationY } = event.nativeEvent;
    
    // Toggle controls visibility
    if (showControls) {
      hideControls();
    } else {
      showControlsWithFade();
    }
    
    // Handle anchored comment creation (optional)
    if (onAnchoredComment && showControls) {
      // You can implement long press for anchored comments
    }
  };

  const seekToTime = (time) => {
    if (videoRef.current) {
      videoRef.current.seek(time);
      setCurrentTime(time);
      onTimeUpdate?.(time);
    }
  };

  const skipBackward = () => {
    const newTime = Math.max(0, currentTime - 10);
    seekToTime(newTime);
    showSeekIndicator('backward', newTime);
    setTimeout(() => hideSeekIndicator(), 500);
  };

  const skipForward = () => {
    const newTime = Math.min(duration, currentTime + 10);
    seekToTime(newTime);
    showSeekIndicator('forward', newTime);
    setTimeout(() => hideSeekIndicator(), 500);
  };

  const onSliderValueChange = (value) => {
    const time = (value / 100) * duration;
    setCurrentTime(time);
    setIsSeeking(true);
  };

  const onSlidingComplete = (value) => {
    const time = (value / 100) * duration;
    seekToTime(time);
    setIsSeeking(false);
  };

  const formatTime = (timeInSeconds) => {
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSliderValue = () => {
    return duration > 0 ? (currentTime / duration) * 100 : 0;
  };

  return (
    <View style={styles.container}>
      <View style={styles.videoTouchArea} {...panResponder.panHandlers}>
        <TouchableOpacity 
          style={styles.videoWrapper} 
          activeOpacity={1}
          onPress={handleVideoTap}
        >
          <Video
            ref={videoRef}
            source={videoSource}
            style={styles.video}
            paused={paused}
            resizeMode="contain"
            onProgress={handleProgress}
            onLoad={handleLoad}
            onError={handleError}
            onLoadStart={handleLoadStart}
            repeat={false}
            controls={false}
            playWhenInactive={false}
            playInBackground={false}
            ignoreSilentSwitch={'ignore'}
          />

          {/* Loading indicator */}
          {loading && (
            <View style={styles.loadingOverlay}>
              <Text style={styles.loadingText}>Loading video...</Text>
            </View>
          )}

          {/* Error overlay */}
          {error && (
            <View style={styles.errorOverlay}>
              <Text style={styles.errorText}>Failed to load video</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={() => {
                  setError(null);
                  setLoading(true);
                }}
              >
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Seek Indicator */}
          <Animated.View 
            style={[styles.seekIndicator, { opacity: seekIndicatorOpacity }]}
            pointerEvents="none"
          >
            {seekDirection === 'forward' ? (
              <FastForward color="#fff" size={40} />
            ) : (
              <Rewind color="#fff" size={40} />
            )}
            <Text style={styles.seekTimeText}>{formatTime(seekTime)}</Text>
          </Animated.View>


          {/* Video Controls */}
          {showControls && (
            <Animated.View style={[styles.controlsContainer, { opacity: controlsOpacity }]}>
              {/* Top Controls */}
              <View style={styles.topControls}>
                <Text style={styles.videoTitle}>Sample Video</Text>
              </View>

              {/* Center Controls */}
              <View style={styles.centerControls}>
                <TouchableOpacity onPress={skipBackward} style={styles.skipButton}>
                  <SkipBack color="#fff" size={30} />
                  <Text style={styles.skipText}>10s</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={togglePlayPause} style={styles.playPauseButton}>
                  {paused ? <Play color="#fff" size={40} /> : <Pause color="#fff" size={40} />}
                </TouchableOpacity>

                <TouchableOpacity onPress={skipForward} style={styles.skipButton}>
                  <SkipForward color="#fff" size={30} />
                  <Text style={styles.skipText}>10s</Text>
                </TouchableOpacity>
              </View>

              {/* Bottom Controls */}
              <View style={styles.bottomControls}>
               
              </View>
            </Animated.View>
          )}

          {/* Render anchored comments */}
          {anchoredComments?.map((comment) => {
            if (Math.abs(comment.timestamp - currentTime) <= 2) {
              return (
                <TouchableOpacity
                  key={comment.id}
                  style={[
                    styles.anchoredCommentDot,
                    {
                      left: comment.x - 10,
                      top: comment.y - 10,
                      backgroundColor: comment.color || '#ff4444',
                    },
                  ]}
                  onPress={() => showCommentModal?.(comment)}
                >
                  <View style={styles.commentDotInner} />
                </TouchableOpacity>
              );
            }
            return null;
          })}
        </TouchableOpacity>
      </View>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <Clock color="#fff" size={18} />
        <TouchableOpacity onPress={togglePlayPause} style={styles.bottomTimeText}>
          {paused ? <Play color="#fff" size={20} /> : <Pause color="#fff" size={20} />}
        </TouchableOpacity>
        <Text style={styles.bottomTimeText}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </Text>
        <MapPin color="#fff" size={18} />
        <MessageCircle color="#fff" size={18} />
        <Send color="#fff" size={18} />
        <MoreHorizontal color="#fff" size={18} />
      </View>
    </View>
  );
});

export default VideoPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoTouchArea: {
    flex: 1,
  },
  videoWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#8B5A2B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  seekIndicator: {
    position: 'absolute',
    alignSelf: 'center',
    top: '40%',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
  },
  seekTimeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 5,
  },
  centerPlayButton: {
    position: 'absolute',
    alignSelf: 'center',
    top: '45%',
  },
  playButtonLarge: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
    borderRadius: 50,
  },
  controlsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  videoTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  centerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
    paddingVertical: 20,
  },
  skipButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 15,
    borderRadius: 25,
  },
  skipText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  playPauseButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
    borderRadius: 35,
  },
  bottomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 15,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    minWidth: 40,
    textAlign: 'center',
  },
  sliderContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  slider: {
    width: '100%',
    height: 20,
  },
  sliderThumb: {
    backgroundColor: '#8B5A2B',
    width: 15,
    height: 15,
  },
  controlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 8,
    borderRadius: 15,
  },
  anchoredCommentDot: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  commentDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  bottomTimeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});