import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Toast from "../components/Toast";
import useLocalAPI from "../hooks/useLocalAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppTheme } from "./ThemeContext";

export default function Register({ navigation }) {
  const { styles, colors } = useAppTheme();
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [mail, setMail] = useState("");
  const [mdp, setMdp] = useState("");
  const [toast, setToast] = useState(null);

  const API_URL = useLocalAPI();

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  const handleRegister = async () => {
    if (!nom || !prenom || !mail || !mdp) {
      showToast("Veuillez remplir tous les champs", "info");
      return;
    }

    if (!API_URL) {
      showToast("Chargement du réseau...", "info");
      return;
    }

    try {
      console.log("📤 Envoi vers:", `${API_URL}/register.php`);
      console.log("📦 Données:", { nom, prenom, mail, mdp: "***" });

      // Étape 1️⃣ — Inscription
      const response = await fetch(`${API_URL}/register.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nom, prenom, mail, mdp }),
      });

      console.log("📥 Status HTTP:", response.status);
      console.log("📥 Headers:", response.headers);

      // Lire la réponse en texte brut d'abord
      const rawText = await response.text();
      console.log("📥 Réponse brute:", rawText);

      // Nettoyer les warnings PHP avant le JSON
      const cleanText = rawText.replace(/<br \/>\s*<b>.*?<\/b>:.*?<br \/>/gi, '').trim();
      console.log("🧹 Réponse nettoyée:", cleanText);

      // Essayer de parser en JSON
      let data;
      try {
        data = JSON.parse(cleanText);
        console.log("✅ JSON parsé:", data);
      } catch (parseError) {
        console.error("❌ Erreur parsing JSON:", parseError);
        console.error("❌ Réponse reçue:", rawText);
        showToast("Erreur serveur (réponse invalide)", "error");
        return;
      }

      if (data.success) {
        showToast("Compte créé ! Connexion...", "success");

        // Étape 2️⃣ — Connexion automatique après inscription
        const loginResponse = await fetch(`${API_URL}/login.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mail, mdp }),
        });

        const loginRawText = await loginResponse.text();
        console.log("📥 Réponse login brute:", loginRawText);

        // Nettoyer les warnings PHP avant le JSON
        const cleanLoginText = loginRawText.replace(/<br \/>\s*<b>.*?<\/b>:.*?<br \/>/gi, '').trim();

        let loginData;
        try {
          loginData = JSON.parse(cleanLoginText);
        } catch (parseError) {
          console.error("❌ Erreur parsing login:", parseError);
          showToast("Compte créé, mais connexion impossible", "error");
          setTimeout(() => navigation.navigate("Connect"), 1500);
          return;
        }

        if (loginData.success) {
          showToast("Bienvenue 🎉", "success");

          // 🔹 Sauvegarde des infos utilisateur
          const userData = {
            id: loginData.id,
            prenom: loginData.prenom,
            nom: loginData.nom,
            mail: loginData.mail,
            role: loginData.role,
          };
          await AsyncStorage.setItem("user", JSON.stringify(userData));

          setTimeout(() => {
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: "Home",
                  params: { prenom: loginData.prenom, role: loginData.role },
                },
              ],
            });
          }, 1200);
        } else {
          showToast("Compte créé, mais connexion impossible", "error");
          setTimeout(() => navigation.navigate("Connect"), 1500);
        }
      } else {
        showToast(data.message || "Erreur lors de l'inscription", "error");
      }
    } catch (error) {
      console.error("❌ Erreur complète:", error);
      console.error("❌ Type d'erreur:", error.name);
      console.error("❌ Message:", error.message);
      showToast("Impossible de contacter le serveur", "error");
    }
  };

  return (
    <View style={styles.register.container}>
      <Text style={styles.register.title}>Créer un compte</Text>

      <View style={styles.register.box}>
        <TextInput
          placeholder="Nom"
          style={styles.register.input}
          value={nom}
          onChangeText={setNom}
        />
        <TextInput
          placeholder="Prénom"
          style={styles.register.input}
          value={prenom}
          onChangeText={setPrenom}
        />
        <TextInput
          placeholder="Email"
          style={styles.register.input}
          value={mail}
          onChangeText={setMail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Mot de passe"
          style={styles.register.input}
          value={mdp}
          onChangeText={setMdp}
          secureTextEntry
        />

        <TouchableOpacity style={styles.register.button} onPress={handleRegister}>
          <Text style={styles.register.buttonText}>S'inscrire</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Connect")}>
          <Text style={styles.register.link}>Déjà un compte ? Connectez-vous</Text>
        </TouchableOpacity>
      </View>

      {toast && (
        <Toast message={toast.message} type={toast.type} onHide={() => setToast(null)} />
      )}
    </View>
  );
}