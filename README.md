# Frame.io Clone - React Native App

## 🚀 Complete Setup Guide

### Prerequisites
- Node.js (v16 or higher)
- React Native CLI
- Android Studio with Android SDK
- Java 11

### 1. Project Creation & Setup

```bash
# Create new React Native project
npx react-native init FrameioClone --version 0.72.0
cd FrameioClone

# Install all dependencies
npm install react-native-video react-native-svg react-native-gesture-handler react-native-vector-icons @react-navigation/native @react-navigation/stack react-native-screens react-native-safe-area-context @react-native-async-storage/async-storage

# For iOS (if needed)
cd ios && pod install && cd ..
```

### 2. Folder Structure Creation

```bash
# Create all required folders and files
mkdir -p src/components src/screens src/utils src/hooks
touch src/components/{VideoPlayer,CommentsList,DrawingTool,TimestampComment}.js
touch src/screens/{HomeScreen,VideoReviewScreen}.js
touch src/utils/{storage,constants}.js
touch src/hooks/{useComments,useDrawing}.js
```

### 3. Android Configuration

#### AndroidManifest.xml Location: `android/app/src/main/AndroidManifest.xml`
Replace the content with the provided AndroidManifest.xml

#### Vector Icons Setup
```bash
# Link vector icons (for React Native < 0.60)
react-native link react-native-vector-icons

# For manual linking, add to android/app/build.gradle:
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

### 4. File Implementation

Copy all the provided component files into their respective locations:

- `App.js` (root)
- `src/screens/HomeScreen.js`
- `src/screens/VideoReviewScreen.js`
- `src/components/VideoPlayer.js`
- `src/components/CommentsList.js`
- `src/components/DrawingTool.js`
- `src/components/TimestampComment.js`
- `src/hooks/useComments.js`
- `src/hooks/useDrawing.js`
- `src/utils/storage.js`
- `src/utils/constants.js`

### 5. Build APK

```bash
# For development build
npx react-native run-android

# For release APK
cd android
./gradlew assembleRelease

# APK will be generated at:
# android/app/build/outputs/apk/release/app-release.apk
```

### 6. Key Features Implemented

✅ **Video Playback**
- Custom video player with play/pause controls
- Seek bar for navigation
- Time display and progress tracking

✅ **Timestamp-based Comments**
- Add comments at specific video timestamps
- View all comments with timestamp links
- Click comment to jump to that time
- Local storage persistence

✅ **Drawing Tool**
- Freehand drawing over video
- Color picker for drawing tools
- SVG-based drawing implementation
- Drawing persistence with timestamps

✅ **Local Storage**
- AsyncStorage for data persistence
- Comments and drawings saved locally
- App state restoration on restart

### 7. Technical Choices Explained

**React Native Video**: Used for robust video playback with extensive controls and customization options.

**AsyncStorage**: Chosen for local data persistence - simple, reliable, and perfect for this use case without backend.

**React Native SVG**: Implemented for drawing functionality - provides smooth, scalable drawing experience with path-based rendering.

**React Navigation**: Stack navigation for smooth screen transitions and professional app flow.

**Custom Hooks**: Created useComments and useDrawing hooks for clean state management and reusable logic.

**Gesture Handler**: Used for smooth drawing interactions and touch handling.

### 8. App Flow

1. **Home Screen**: Welcome screen with feature overview and start button
2. **Video Review Screen**: Main interface with video player, drawing tools, and comment system
3. **Drawing Mode**: Toggle drawing overlay with color selection
4. **Comment System**: Modal-based comment input with timestamp association
5. **Comments List**: Scrollable list showing all comments with navigation

### 9. APK Generation Commands

```bash
# Clean and build release APK
cd android
./gradlew clean
./gradlew assembleRelease

# Install release APK on connected device
./gradlew installRelease
```

### 10. Testing Features

- Load video and test play/pause functionality
- Add comments at different timestamps
- Test drawing with different colors
- Verify data persistence by closing and reopening app
- Test comment navigation by clicking on comments

## 📱 Design Implementation

The app follows the Frame.io design principles with:
- Clean, modern UI with Material Design elements
- Intuitive navigation and controls
- Professional color scheme (primary: #6366f1)
- Responsive layout for different screen sizes
- Smooth animations and transitions

## 🔧 Troubleshooting

**Video not playing**: Ensure network permissions and check video URL accessibility

**Drawing not working**: Verify gesture-handler is properly linked and configured

**Storage issues**: Check AsyncStorage permissions and implementation

**Build errors**: Ensure all dependencies are properly installed and linked

This implementation provides a complete Frame.io-style video review application with all requested features working seamlessly on Android devices.