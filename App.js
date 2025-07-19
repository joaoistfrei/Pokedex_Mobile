import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListScreen from './src/screens/ListScreen';
import DetailsScreen from './src/screens/DetailsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Pokédex"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Pokédex" component={ListScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
