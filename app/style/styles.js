// style.js
import { StyleSheet, Platform, StatusBar, useColorScheme } from "react-native";

// Fonction pour obtenir les couleurs selon le thème
export const getColors = (isDark) => ({
  // Backgrounds
  primary: isDark ? "#0f0f1e" : "#f8f9fa",
  secondary: isDark ? "#1a1a2e" : "#ffffff",
  card: isDark ? "#252540" : "#ffffff",
  
  // Textes
  textPrimary: isDark ? "#ffffff" : "#2c3e50",
  textSecondary: isDark ? "#b0b0b0" : "#666666",
  textTertiary: isDark ? "#808080" : "#999999",
  
  // Accents
  accent: isDark ? "#3498db" : "#2c3e50",
  accentLight: isDark ? "#5dade2" : "#34495e",
  
  // Bordures
  border: isDark ? "#3a3a4e" : "#e0e0e0",
  borderLight: isDark ? "#2a2a3e" : "#f0f0f0",
  
  // Inputs
  input: isDark ? "#1e1e2e" : "#f5f5f5",
  
  // Statuts
  success: "#27ae60",
  danger: "#e74c3c",
  warning: "#f39c12",
});

// Hook personnalisé pour utiliser le thème
export const useTheme = () => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors = getColors(isDark);
  return { colors, isDark };
};

// Fonction pour créer les styles avec les couleurs
export const createStyles = (colors) => ({
  
  /* ------------------------------------
     CONNECT SCREEN
  ------------------------------------ */
  connect: StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
    title: {
      fontSize: 36,
      fontWeight: "bold",
      color: colors.textPrimary,
      marginBottom: 40,
    },
    box: {
      backgroundColor: colors.card,
      padding: 25,
      borderRadius: 12,
      width: "90%",
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 8,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    input: {
      backgroundColor: colors.input,
      padding: 12,
      borderRadius: 8,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: colors.border,
      color: colors.textPrimary,
    },
    button: {
      backgroundColor: colors.accent,
      padding: 15,
      borderRadius: 8,
      alignItems: "center",
      marginVertical: 10,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 16,
    },
    link: {
      color: colors.accent,
      textAlign: "center",
      marginTop: 10,
    },
    devButton: {
      marginTop: 15,
      backgroundColor: colors.input,
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    devButtonText: {
      color: colors.textSecondary,
      fontSize: 14,
    },
  }),

  /* ------------------------------------
     HOME SCREEN
  ------------------------------------ */
  home: StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.primary,
    },
    header: {
      width: "100%",
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 20 : 70,
      paddingBottom: 14,
      paddingHorizontal: 20,
      backgroundColor: colors.secondary,
      justifyContent: "center",
      alignItems: "flex-start",
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 3,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    inlineHeader: {
      flexDirection: "row",
      alignItems: "baseline",
      flexWrap: "wrap",
    },
    groovzText: {
      fontSize: 26,
      fontWeight: "bold",
      color: colors.textPrimary,
    },
    greetingText: {
      fontSize: 16,
      color: colors.textSecondary,
      fontWeight: "400",
      marginLeft: 6,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    subtitle: {
      fontSize: 18,
      color: colors.textPrimary,
      marginBottom: 10,
      marginTop: 10,
      paddingHorizontal: 25,
      fontWeight: "600",
    },
    scroll: {
      alignItems: "flex-start",
      paddingHorizontal: 25,
      paddingBottom: 120,
    },
    emptyText: {
      color: colors.textSecondary,
      fontSize: 14,
      fontStyle: "italic",
      marginTop: 20,
    },
    boiteCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      paddingVertical: 15,
      paddingHorizontal: 20,
      marginVertical: 8,
      width: "100%",
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    boiteName: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    navbar: {
      position: "absolute",
      bottom: 0,
      width: "100%",
      height: 75,
      backgroundColor: colors.secondary,
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    navItem: {
      alignItems: "center",
    },
    navText: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 3,
    },
    icons: {
      color: colors.textSecondary,
    },
    apiText: {
      position: "absolute",
      bottom: 85,
      color: colors.textTertiary,
      fontSize: 11,
      alignSelf: "center",
    },
  }),

  /* ------------------------------------
     DETAILS BOITE SCREEN
  ------------------------------------ */
  details: StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.primary,
    },
    header: {
      width: "100%",
      paddingTop: 55,
      paddingBottom: 15,
      backgroundColor: colors.secondary,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      marginRight: 10,
    },
    headerTitle: {
      fontSize: 22,
      color: colors.textPrimary,
      fontWeight: "bold",
    },
    scroll: {
      padding: 20,
    },
    image: {
      width: "100%",
      height: 220,
      borderRadius: 12,
      marginBottom: 20,
    },
    boiteName: {
      fontSize: 26,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: 20,
    },
    card: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      padding: 14,
      borderRadius: 12,
      marginBottom: 15,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    cardText: {
      fontSize: 15,
      color: colors.textPrimary,
      marginLeft: 8,
      flexShrink: 1,
    },
    toggle: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 15,
    },
    toggleText: {
      color: colors.textPrimary,
      fontWeight: "600",
      fontSize: 16,
      marginRight: 5,
    },
    horairesCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 14,
      marginBottom: 30,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    horaireRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 4,
    },
    jourText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    plageText: {
      fontSize: 14,
      color: colors.textPrimary,
      fontWeight: "500",
    },
  }),

  /* ------------------------------------
     REGISTER SCREEN
  ------------------------------------ */
  register: StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.textPrimary,
      marginBottom: 30,
    },
    box: {
      backgroundColor: colors.card,
      padding: 25,
      borderRadius: 12,
      width: "90%",
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 8,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    input: {
      backgroundColor: colors.input,
      padding: 12,
      borderRadius: 8,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: colors.border,
      color: colors.textPrimary,
    },
    button: {
      backgroundColor: colors.accent,
      padding: 15,
      borderRadius: 8,
      alignItems: "center",
      marginVertical: 10,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 16,
    },
    link: {
      color: colors.accent,
      textAlign: "center",
      marginTop: 10,
    },
  }),

  /* ------------------------------------
     SETTINGS SCREEN
  ------------------------------------ */
  settings: StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "space-between",
      padding: 20,
    },
    header: {
      marginTop: 40,
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    backButton: {
      position: "absolute",
      left: 10,
    },
    headerTitle: {
      color: colors.textPrimary,
      fontSize: 26,
      fontWeight: "bold",
    },
    profileBox: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 25,
      width: "90%",
      alignItems: "center",
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    userName: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.textPrimary,
      marginBottom: 5,
    },
    userMail: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 15,
    },
    updateButton: {
      backgroundColor: colors.accent,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
    },
    updateText: {
      color: "#fff",
      fontWeight: "600",
    },
    editBox: {
      width: "100%",
      marginTop: 10,
    },
    input: {
      backgroundColor: colors.input,
      padding: 12,
      borderRadius: 8,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.border,
      color: colors.textPrimary,
    },
    saveButton: {
      backgroundColor: colors.success,
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
      marginVertical: 10,
    },
    saveText: {
      color: "#fff",
      fontWeight: "600",
    },
    cancelText: {
      textAlign: "center",
      color: colors.accent,
      textDecorationLine: "underline",
    },
    bottomButtons: {
      width: "100%",
      alignItems: "center",
      marginBottom: 30,
    },
    logoutButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      padding: 12,
      borderRadius: 8,
      width: "90%",
      justifyContent: "center",
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    logoutText: {
      color: colors.accent,
      fontWeight: "600",
      marginLeft: 8,
    },
    deleteButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.danger,
      padding: 12,
      borderRadius: 8,
      width: "90%",
      justifyContent: "center",
    },
    deleteText: {
      color: "#fff",
      fontWeight: "600",
      marginLeft: 8,
    },
  }),
});

// Export par défaut pour compatibilité (thème clair)
export const styles = createStyles(getColors(false));