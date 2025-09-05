import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = ({navigation}) => {
  const handleStartReview = () => {
    navigation.navigate('VideoReview');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Icon name="video-library" size={80} color="#6366f1" />
          <Text style={styles.title}>Frame.io Clone</Text>
          <Text style={styles.subtitle}>
            Review videos with comments and drawings
          </Text>
        </View>

        <View style={styles.features}>
          <View style={styles.featureItem}>
            <Icon name="play-circle-outline" size={40} color="#10b981" />
            <Text style={styles.featureText}>Video Playback</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="comment" size={40} color="#f59e0b" />
            <Text style={styles.featureText}>Timestamp Comments</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="brush" size={40} color="#ef4444" />
            <Text style={styles.featureText}>Drawing Tools</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={handleStartReview}>
          <Text style={styles.startButtonText}>Start Video Review</Text>
          <Icon name="arrow-forward" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-around',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 10,
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 40,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureText: {
    marginTop: 10,
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
    fontWeight: '500',
  },
  startButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    elevation: 4,
    shadowColor: '#6366f1',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default HomeScreen;