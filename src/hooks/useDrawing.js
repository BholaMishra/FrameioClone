import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DRAWINGS_STORAGE_KEY = '@frameio_drawings';

const useDrawing = () => {
  const [drawings, setDrawings] = useState([]);

  // Load drawings from storage on mount
  useEffect(() => {
    loadDrawings();
  }, []);

  const loadDrawings = async () => {
    try {
      const storedDrawings = await AsyncStorage.getItem(DRAWINGS_STORAGE_KEY);
      if (storedDrawings) {
        const parsedDrawings = JSON.parse(storedDrawings);
        setDrawings(parsedDrawings);
      }
    } catch (error) {
      console.error('Error loading drawings:', error);
    }
  };

  const saveDrawings = async (drawingsToSave) => {
    try {
      await AsyncStorage.setItem(
        DRAWINGS_STORAGE_KEY,
        JSON.stringify(drawingsToSave)
      );
    } catch (error) {
      console.error('Error saving drawings:', error);
    }
  };

  const addDrawing = (timestamp, path, color) => {
    const newDrawing = {
      id: Date.now().toString(),
      timestamp: Math.round(timestamp),
      path: path,
      color: color,
      createdAt: new Date().toISOString(),
    };

    const updatedDrawings = [...drawings, newDrawing];
    setDrawings(updatedDrawings);
    saveDrawings(updatedDrawings);
  };

  const removeDrawing = (drawingId) => {
    const updatedDrawings = drawings.filter(drawing => drawing.id !== drawingId);
    setDrawings(updatedDrawings);
    saveDrawings(updatedDrawings);
  };

  const clearAllDrawings = () => {
    setDrawings([]);
    AsyncStorage.removeItem(DRAWINGS_STORAGE_KEY);
  };

  const getDrawingsForTimestamp = (timestamp, tolerance = 2) => {
    return drawings.filter(
      drawing => Math.abs(drawing.timestamp - timestamp) <= tolerance
    );
  };

  return {
    drawings,
    addDrawing,
    removeDrawing,
    clearAllDrawings,
    getDrawingsForTimestamp,
    reloadDrawings: loadDrawings,
  };
};

export default useDrawing;