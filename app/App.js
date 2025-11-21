import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ThemeProvider } from './screens/ThemeContext';

import Connect from "./screens/connect";
import Register from "./screens/register";
import Home from "./screens/home";
import Settings from "./screens/settings";
import BoiteDetail from "./screens/BoiteDetail";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Connect">
        {/* Page de connexion */}
        <Stack.Screen
          name="Connect"
          component={Connect}
          options={{ headerShown: false }}
        />

        {/* Page d’inscription */}
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />

        {/* Page d’accueil */}
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false,
            gestureEnabled: false, // empêche le retour par swipe
            animation: "none", // supprime l’animation pour éviter le flick
          }}
        />

        {/* Page paramètres */}
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{
            headerShown: false,
            animation: "slide_from_right", // transition douce latérale
          }}
        />

        {/* Page détail boîte */}
        <Stack.Screen
          name="BoiteDetail"
          component={BoiteDetail}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </ThemeProvider>
  );
}
