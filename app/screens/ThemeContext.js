// ThemeContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getColors, createStyles } from '../style/styles';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemTheme = useColorScheme(); // 'light' ou 'dark'
  const [themeMode, setThemeMode] = useState('auto'); // 'light', 'dark', 'auto'
  
  // Détermine si on utilise le mode sombre
  const isDark = themeMode === 'auto' 
    ? systemTheme === 'dark' 
    : themeMode === 'dark';
  
  const colors = getColors(isDark);
  const styles = createStyles(colors);

  // 🔹 Charger la préférence au démarrage
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem('themeMode');
        if (saved) setThemeMode(saved);
      } catch (error) {
        console.error('Erreur chargement thème:', error);
      }
    };
    loadTheme();
  }, []);

  // 🔹 Sauvegarder la préférence
  const changeTheme = async (newMode) => {
    try {
      setThemeMode(newMode);
      await AsyncStorage.setItem('themeMode', newMode);
    } catch (error) {
      console.error('Erreur sauvegarde thème:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      colors, 
      styles, 
      isDark, 
      themeMode, 
      changeTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme doit être utilisé dans un ThemeProvider');
  }
  return context;
};