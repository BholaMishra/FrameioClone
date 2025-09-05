import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {StatusBar, Platform} from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import VideoReviewScreen from './src/screens/VideoReviewScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#6366f1" 
        translucent={false}
      />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#6366f1',
              elevation: 4,
              shadowOpacity: 0.3,
              shadowRadius: 4,
              shadowColor: '#000',
              shadowOffset: {height: 2, width: 0},
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 18,
            },
            headerTitleAlign: 'center',
          }}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Frame.io Clone',
              headerStyle: {
                backgroundColor: '#6366f1',
              },
            }}
          />
          <Stack.Screen
            name="VideoReview"
            component={VideoReviewScreen}
            options={{
              title: 'Video Review',
              headerBackTitleVisible: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;