import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  COMMENTS: '@frameio_comments',
  DRAWINGS: '@frameio_drawings',
  USER_PREFERENCES: '@frameio_preferences',
};

class StorageService {
  static async setItem(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (error) {
      console.error('Storage setItem error:', error);
      return false;
    }
  }

  static async getItem(key) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Storage getItem error:', error);
      return null;
    }
  }

  static async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Storage removeItem error:', error);
      return false;
    }
  }

  static async clear() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  }

  static async getAllKeys() {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Storage getAllKeys error:', error);
      return [];
    }
  }

  static async multiGet(keys) {
    try {
      const result = await AsyncStorage.multiGet(keys);
      return result.reduce((acc, [key, value]) => {
        acc[key] = value ? JSON.parse(value) : null;
        return acc;
      }, {});
    } catch (error) {
      console.error('Storage multiGet error:', error);
      return {};
    }
  }

  // Specific methods for the app
  static async saveComments(comments) {
    return this.setItem(STORAGE_KEYS.COMMENTS, comments);
  }

  static async getComments() {
    return this.getItem(STORAGE_KEYS.COMMENTS) || [];
  }

  static async saveDrawings(drawings) {
    return this.setItem(STORAGE_KEYS.DRAWINGS, drawings);
  }

  static async getDrawings() {
    return this.getItem(STORAGE_KEYS.DRAWINGS) || [];
  }

  static async saveUserPreferences(preferences) {
    return this.setItem(STORAGE_KEYS.USER_PREFERENCES, preferences);
  }

  static async getUserPreferences() {
    return this.getItem(STORAGE_KEYS.USER_PREFERENCES) || {
      defaultDrawingColor: '#ff0000',
      autoPlay: false,
    };
  }
}

export default StorageService;
export {STORAGE_KEYS};