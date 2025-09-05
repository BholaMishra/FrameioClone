import React, {useState, useRef, useImperativeHandle, forwardRef, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Alert} from 'react-native';
import Slider from '@react-native-community/slider';   // ✅ Correct package
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';

const VideoPlayer = forwardRef(({onTimeUpdate, onPlaybackStateChange, onVideoPause}, ref) => {
  const [paused, setPaused] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [seeking, setSeeking] = useState(false);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const controlsTimeout = useRef(null);

  useImperativeHandle(ref, () => ({
    seek: (time) => {
      if (videoRef.current) {
        videoRef.current.seek(time);
      }
    },
    getCurrentTime: () => currentTime,
    getDuration: () => duration,
    pause: () => {
      setPaused(true);
      onPlaybackStateChange?.(false);
    },
    play: () => {
      setPaused(false);
      onPlaybackStateChange?.(true);
    },
  }));

  useEffect(() => {
    if (showControls) {
      resetControlsTimeout();
    }
    return () => {
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    };
  }, [showControls]);

  const resetControlsTimeout = () => {
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    controlsTimeout.current = setTimeout(() => {
      if (!paused) {
        setShowControls(false);
      }
    }, 4000);
  };

  const handlePlayPause = () => {
    const newPausedState = !paused;
    setPaused(newPausedState);
    onPlaybackStateChange?.(!newPausedState);

    if (newPausedState) {
      onVideoPause?.(currentTime);
    }

    if (!newPausedState) {
      resetControlsTimeout();
    }
  };

  const handleProgress = (data) => {
    if (!seeking) {
      const time = data.currentTime;
      setCurrentTime(time);
      onTimeUpdate?.(time);
    }
  };

  const handleLoad = (data) => {
    setDuration(data.duration);
    setLoading(false);
  };

  const handleLoadStart = () => {
    setLoading(true);
  };

  const handleError = (error) => {
    Alert.alert('Video Error', 'Unable to load video. Please check your connection and try again.');
    console.error('Video error:', error);
    setLoading(false);
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSliderValueChange = (value) => {
    setSeeking(true);
    setCurrentTime(value);
  };

  const handleSlidingComplete = (value) => {
    setSeeking(false);
    if (videoRef.current) {
      videoRef.current.seek(value);
      setCurrentTime(value);
      onTimeUpdate?.(value);
    }
  };

  const handleVideoPress = () => {
    setShowControls(!showControls);
    if (!showControls) {
      resetControlsTimeout();
    }
  };

  const handleRewind = () => {
    const newTime = Math.max(0, currentTime - 10);
    if (videoRef.current) {
      videoRef.current.seek(newTime);
      setCurrentTime(newTime);
    }
  };

  const handleForward = () => {
    const newTime = Math.min(duration, currentTime + 10);
    if (videoRef.current) {
      videoRef.current.seek(newTime);
      setCurrentTime(newTime);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.videoTouchArea}
        onPress={handleVideoPress}
        activeOpacity={1}>
        <Video
          ref={videoRef}
          source={{
            uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          }}
          style={styles.video}
          paused={paused}
          resizeMode="contain"
          onProgress={handleProgress}
          onLoad={handleLoad}
          onLoadStart={handleLoadStart}
          onError={handleError}
          progressUpdateInterval={100}
          ignoreSilentSwitch="ignore"
        />
      </TouchableOpacity>

      {loading && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>Loading Video...</Text>
        </View>
      )}

      {showControls && !loading && (
        <View style={styles.controlsOverlay}>
          <View style={styles.centerControls}>
            <TouchableOpacity style={styles.controlButton} onPress={handleRewind}>
              <Icon name="replay-10" size={36} color="#ffffff" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.playPauseButton} onPress={handlePlayPause}>
              <Icon name={paused ? 'play-arrow' : 'pause'} size={48} color="#ffffff" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton} onPress={handleForward}>
              <Icon name="forward-10" size={36} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <View style={styles.bottomControls}>
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>

            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={duration}
              value={currentTime}
              onValueChange={handleSliderValueChange}
              onSlidingComplete={handleSlidingComplete}
              minimumTrackTintColor="#6366f1"
              maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
              thumbTintColor="#6366f1"
            />

            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  videoTouchArea: {
    flex: 1,
  },
  video: {
    flex: 1,
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
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  centerControls: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButton: {
    padding: 20,
    marginHorizontal: 20,
  },
  playPauseButton: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 40,
  },
  bottomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  timeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    minWidth: 55,
    textAlign: 'center',
  },
  slider: {
    flex: 1,
    marginHorizontal: 15,
    height: 40,
  },
});

export default VideoPlayer;
