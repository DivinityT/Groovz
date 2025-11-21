import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import Toast from "../components/Toast";
import useLocalAPI from "../hooks/useLocalAPI";
import { useAppTheme } from "./ThemeContext";

export default function Settings({ navigation }) {
  const { styles, colors, themeMode, changeTheme } = useAppTheme();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [toast, setToast] = useState(null);

  const API_URL = useLocalAPI();

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  // 🔹 Chargement du user stocké localement
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setNom(parsed.nom);
        setPrenom(parsed.prenom);
      }
    };
    loadUser();
  }, []);

  // 🔹 Mise à jour du profil
  const handleUpdateProfile = async () => {
    if (!nom || !prenom) {
      showToast("Veuillez remplir tous les champs", "info");
      return;
    }

    if (!API_URL) {
      showToast("Chargement du réseau...", "info");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/update_user.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, nom, prenom }),
      });

      const rawText = await response.text();
      
      // Nettoyer les warnings PHP
      const cleanText = rawText.replace(/<br \/>\s*<b>.*?<\/b>:.*?<br \/>/gi, '').trim();

      try {
        const data = JSON.parse(cleanText);

        if (data.success) {
          showToast("Profil mis à jour ✅", "success");
          const updatedUser = { ...user, nom, prenom };
          await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
          setUser(updatedUser);
          setEditMode(false);
        } else {
          showToast(data.message || "Erreur lors de la mise à jour", "error");
        }
      } catch (parseError) {
        console.error("❌ Erreur parsing:", parseError);
        showToast("Erreur serveur (réponse invalide)", "error");
      }
    } catch (err) {
      console.error("❌ Erreur réseau:", err);
      showToast("Impossible de contacter le serveur", "error");
    }
  };

  // 🔹 Déconnexion
  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    navigation.reset({ index: 0, routes: [{ name: "Connect" }] });
  };

  // 🔹 Suppression du compte
  const handleDeleteAccount = async () => {
    Alert.alert(
      "Suppression du compte",
      "Supprimer ton compte ? Cette action est irréversible.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/delete_user.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: user.id }),
              });

              const rawText = await response.text();
              const cleanText = rawText.replace(/<br \/>\s*<b>.*?<\/b>:.*?<br \/>/gi, '').trim();
              
              await AsyncStorage.removeItem("user");
              navigation.reset({ index: 0, routes: [{ name: "Connect" }] });
              showToast("Compte supprimé", "error");
            } catch (err) {
              console.error("❌ Erreur suppression:", err);
              showToast("Erreur lors de la suppression", "error");
            }
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.settings.container}>
        <Text style={{ color: colors.textPrimary }}>Chargement...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.settings.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* 🔹 Header */}
      <View style={styles.settings.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.settings.backButton}>
          <Ionicons name="chevron-back-outline" size={28} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.settings.headerTitle}>Groov'z</Text>
      </View>

      {/* 🔹 Profil */}
      <View style={styles.settings.profileBox}>
        <Ionicons name="person-circle-outline" size={80} color={colors.accent} style={{ marginBottom: 10 }} />
        {!editMode ? (
          <>
            <Text style={styles.settings.userName}>{user.prenom} {user.nom}</Text>
            <Text style={styles.settings.userMail}>{user.mail}</Text>

            <TouchableOpacity
              style={styles.settings.updateButton}
              onPress={() => setEditMode(true)}
            >
              <Text style={styles.settings.updateText}>✏️ Mettre à jour mon profil</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.settings.editBox}>
            <TextInput
              placeholder="Nouveau prénom"
              placeholderTextColor={colors.textSecondary}
              style={styles.settings.input}
              value={prenom}
              onChangeText={setPrenom}
            />
            <TextInput
              placeholder="Nouveau nom"
              placeholderTextColor={colors.textSecondary}
              style={styles.settings.input}
              value={nom}
              onChangeText={setNom}
            />

            <TouchableOpacity style={styles.settings.saveButton} onPress={handleUpdateProfile}>
              <Text style={styles.settings.saveText}>Enregistrer</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setEditMode(false)}>
              <Text style={styles.settings.cancelText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* 🔹 SÉLECTEUR DE THÈME */}
      <View style={[styles.settings.profileBox, { marginTop: 20 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
          <Ionicons name="color-palette-outline" size={24} color={colors.accent} />
          <Text style={[styles.settings.userName, { fontSize: 18, marginBottom: 0, marginLeft: 10 }]}>
            Thème de l'application
          </Text>
        </View>

        <View style={{ width: "100%", gap: 10 }}>
          {/* Option Clair */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 15,
              borderRadius: 10,
              borderWidth: 2,
              backgroundColor: themeMode === 'light' ? colors.accent : colors.input,
              borderColor: themeMode === 'light' ? colors.accent : colors.border,
            }}
            onPress={() => changeTheme('light')}
          >
            <Ionicons 
              name="sunny-outline" 
              size={24} 
              color={themeMode === 'light' ? '#fff' : colors.textPrimary} 
            />
            <Text style={{ 
              color: themeMode === 'light' ? '#fff' : colors.textPrimary,
              fontWeight: '600',
              marginLeft: 10,
              flex: 1
            }}>
              Clair
            </Text>
            {themeMode === 'light' && (
              <Ionicons name="checkmark-circle" size={24} color="#fff" />
            )}
          </TouchableOpacity>

          {/* Option Sombre */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 15,
              borderRadius: 10,
              borderWidth: 2,
              backgroundColor: themeMode === 'dark' ? colors.accent : colors.input,
              borderColor: themeMode === 'dark' ? colors.accent : colors.border,
            }}
            onPress={() => changeTheme('dark')}
          >
            <Ionicons 
              name="moon-outline" 
              size={24} 
              color={themeMode === 'dark' ? '#fff' : colors.textPrimary} 
            />
            <Text style={{ 
              color: themeMode === 'dark' ? '#fff' : colors.textPrimary,
              fontWeight: '600',
              marginLeft: 10,
              flex: 1
            }}>
              Sombre
            </Text>
            {themeMode === 'dark' && (
              <Ionicons name="checkmark-circle" size={24} color="#fff" />
            )}
          </TouchableOpacity>

          {/* Option Auto */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 15,
              borderRadius: 10,
              borderWidth: 2,
              backgroundColor: themeMode === 'auto' ? colors.accent : colors.input,
              borderColor: themeMode === 'auto' ? colors.accent : colors.border,
            }}
            onPress={() => changeTheme('auto')}
          >
            <Ionicons 
              name="phone-portrait-outline" 
              size={24} 
              color={themeMode === 'auto' ? '#fff' : colors.textPrimary} 
            />
            <Text style={{ 
              color: themeMode === 'auto' ? '#fff' : colors.textPrimary,
              fontWeight: '600',
              marginLeft: 10,
              flex: 1
            }}>
              Auto (système)
            </Text>
            {themeMode === 'auto' && (
              <Ionicons name="checkmark-circle" size={24} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* 🔹 Boutons bas de page */}
      <View style={styles.settings.bottomButtons}>
        <TouchableOpacity style={styles.settings.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={colors.accent} />
          <Text style={styles.settings.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settings.deleteButton} onPress={handleDeleteAccount}>
          <Ionicons name="trash-outline" size={20} color="#fff" />
          <Text style={styles.settings.deleteText}>Supprimer mon compte</Text>
        </TouchableOpacity>
      </View>

      {toast && (
        <Toast message={toast.message} type={toast.type} onHide={() => setToast(null)} />
      )}
    </KeyboardAvoidingView>
  );
}