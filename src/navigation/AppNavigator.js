import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Importar suas screens aqui quando criá-las
// import HomeScreen from '../screens/HomeScreen';
// import PokemonDetailScreen from '../screens/PokemonDetailScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#d30b0bff',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {/* Adicione suas screens aqui */}
      {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
      {/* <Stack.Screen name="PokemonDetail" component={PokemonDetailScreen} /> */}
    </Stack.Navigator>
  );
};

export default AppNavigator;
