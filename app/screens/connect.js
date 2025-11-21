import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "../components/Toast";
import useLocalAPI from "../hooks/useLocalAPI";
import { useAppTheme } from "./ThemeContext";

export default function Connect({ navigation }) {
  const { styles, colors } = useAppTheme();
  const [mail, setMail] = useState("");
  const [mdp, setMdp] = useState("");
  const [toast, setToast] = useState(null);
  const API_URL = useLocalAPI();

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  const handleLogin = async () => {
    if (!mail || !mdp) {
      showToast("Veuillez remplir tous les champs", "info");
      return;
    }

    if (!API_URL) {
      showToast("Chargement du réseau...", "info");
      return;
    }

    try {

      const response = await fetch(`${API_URL}/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mail, mdp }),
      });

      console.log("📥 Status HTTP:", response.status);
      console.log("📥 Headers:", response.headers);

      // Lire la réponse en texte brut d'abord
      const rawText = await response.text();

      // Nettoyer les warnings PHP avant le JSON
      const cleanText = rawText.replace(/<br \/>\s*<b>.*?<\/b>:.*?<br \/>/gi, '').trim();

      // Essayer de parser en JSON
      let data;
      try {
        data = JSON.parse(cleanText);
        console.log("✅ JSON parsé:", data);
      } catch (parseError) {
        showToast("Erreur serveur (réponse invalide)", "error");
        return;
      }

      if (data.success) {
        showToast("Connexion réussie ✅", "success");

        // 🔹 Sauvegarde utilisateur localement
        const userData = {
          id: data.id,
          prenom: data.prenom,
          nom: data.nom,
          mail: data.mail,
          role: data.role,
        };
        await AsyncStorage.setItem("user", JSON.stringify(userData));

        // 🔹 Redirection
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [
              { name: "Home", params: { prenom: data.prenom, role: data.role } },
            ],
          });
        }, 1000);
      } else {
        showToast(data.message || "Identifiants invalides", "error");
      }
    } catch (error) {
      console.error("❌ Erreur complète:", error);
      console.error("❌ Type d'erreur:", error.name);
      console.error("❌ Message:", error.message);
      showToast("Impossible de contacter le serveur", "error");
    }
  };

  // 🔹 Bouton de connexion rapide (pour le dev)
  const devLogin = async () => {
  const devMail = "jules.biron@groovz.ovh";    // 👉 Tu changes ça
  const devMdp  = "aqwzsx1209";      // 👉 Et ça

  try {
    const response = await fetch(`${API_URL}/login.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mail: devMail,
        mdp: devMdp,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      console.log("Erreur de connexion dev:", data.message);
      return;
    }

    // Stocker le vrai user renvoyé par l'API
    await AsyncStorage.setItem("user", JSON.stringify(data));

    // Navigation Home
    navigation.reset({
      index: 0,
      routes: [{ name: "Home", params: data }],
    });

  } catch (error) {
    console.log("Erreur devLogin:", error);
  }
};

  return (
    <View style={styles.connect.container}>
      <Text style={styles.connect.title}>Groov'z</Text>

      <View style={styles.connect.box}>
        <TextInput
          placeholder="Email"
          style={styles.connect.input}
          value={mail}
          onChangeText={setMail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Mot de passe"
          style={styles.connect.input}
          value={mdp}
          onChangeText={setMdp}
          secureTextEntry
        />

        <TouchableOpacity style={styles.connect.button} onPress={handleLogin}>
          <Text style={styles.connect.buttonText}>Connexion</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.connect.link}>Vous n'avez pas de compte ? Créez-en un</Text>
        </TouchableOpacity>

        {/* 🔹 Bouton dev rapide */}
        <TouchableOpacity onPress={devLogin} style={styles.connect.devButton}>
          <Text style={styles.connect.devButtonText}>⚙️ Connexion rapide (dev)</Text>
        </TouchableOpacity>
      </View>

      {toast && (
        <Toast message={toast.message} type={toast.type} onHide={() => setToast(null)} />
      )}
    </View>
  );
}