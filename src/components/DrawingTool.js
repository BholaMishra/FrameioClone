import React, {useState, useRef} from 'react';
import {
  View,
  PanResponder,
  Dimensions,
  StyleSheet,
} from 'react-native';

const {width, height} = Dimensions.get('window');

const DrawingTool = ({drawings, onDrawingComplete, selectedColor}) => {
  const [currentPath, setCurrentPath] = useState([]);
  const [allPaths, setAllPaths] = useState([]);
  const pathRef = useRef([]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,

    onPanResponderGrant: (event) => {
      const {locationX, locationY} = event.nativeEvent;
      const newPoint = {x: locationX, y: locationY};
      setCurrentPath([newPoint]);
      pathRef.current = [newPoint];
    },

    onPanResponderMove: (event) => {
      const {locationX, locationY} = event.nativeEvent;
      const newPoint = {x: locationX, y: locationY};
      const updatedPath = [...pathRef.current, newPoint];
      setCurrentPath(updatedPath);
      pathRef.current = updatedPath;
    },

    onPanResponderRelease: () => {
      if (currentPath.length > 0) {
        const newDrawing = {
          id: Date.now().toString(),
          path: currentPath,
          color: selectedColor,
          timestamp: Date.now(),
        };
        
        const updatedPaths = [...allPaths, newDrawing];
        setAllPaths(updatedPaths);
        onDrawingComplete?.(newDrawing);
        
        setCurrentPath([]);
        pathRef.current = [];
      }
    },
  });

  const renderDot = (point, color, key) => (
    <View
      key={key}
      style={[
        styles.dot,
        {
          backgroundColor: color,
          left: point.x - 2,
          top: point.y - 2,
        },
      ]}
    />
  );

  const renderPath = (pathPoints, color) => {
    if (!pathPoints || pathPoints.length < 2) return null;
    
    return pathPoints.map((point, index) => {
      if (index === 0) return null;
      
      const prevPoint = pathPoints[index - 1];
      const distance = Math.sqrt(
        Math.pow(point.x - prevPoint.x, 2) + Math.pow(point.y - prevPoint.y, 2)
      );
      
      if (distance > 1) {
        // Create intermediate points for smoother lines
        const steps = Math.ceil(distance / 2);
        const intermediatePoints = [];
        
        for (let i = 0; i <= steps; i++) {
          const ratio = i / steps;
          const intermediateX = prevPoint.x + (point.x - prevPoint.x) * ratio;
          const intermediateY = prevPoint.y + (point.y - prevPoint.y) * ratio;
          intermediatePoints.push({x: intermediateX, y: intermediateY});
        }
        
        return intermediatePoints.map((intermPoint, intermIndex) => (
          <View
            key={`line-${index}-${intermIndex}`}
            style={[
              styles.dot,
              {
                backgroundColor: color,
                left: intermPoint.x - 2,
                top: intermPoint.y - 2,
              },
            ]}
          />
        ));
      }
      
      return null;
    });
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Existing drawings */}
      {drawings.map((drawing, index) =>
        drawing.path.map((point, pointIndex) =>
          renderDot(point, drawing.color, `existing-${index}-${pointIndex}`)
        )
      )}
      
      {/* All completed paths */}
      {allPaths.map((pathData, index) => (
        <View key={`completed-${index}`}>
          {renderPath(pathData.path, pathData.color)}
        </View>
      ))}
      
      {/* Current drawing path */}
      <View>
        {renderPath(currentPath, selectedColor)}
      </View>
      
      {/* Current path dots */}
      {currentPath.map((point, index) =>
        renderDot(point, selectedColor, `current-${index}`)
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  dot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    opacity: 0.8,
  },
});

export default DrawingTool;