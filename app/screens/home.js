import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Platform, 
  StatusBar 
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import useLocalAPI from "../hooks/useLocalAPI";
import { useAppTheme } from "./ThemeContext";

export default function Home() {
  const { styles, colors } = useAppTheme();
  const navigation = useNavigation();
  const route = useRoute();

  const { prenom = "Utilisateur", role = "classique", nom="Mr/Mme" } = route.params || {};
  const [boites, setBoites] = useState([]);
  const apiUrl = useLocalAPI();

  const hours = new Date().getHours();
  const greeting = hours >= 18 ? "Bonsoir" : "Bonjour";

  const getTitle = () => {
    switch (role) {
      case "admin":
        return `Groov'z - ${prenom} ${nom} (Admin)`;
      case "gerant":
        return "Groov'z - Gérant";
      default:
        return "Groov'z";
    }
  };

  useEffect(() => {
    if (!apiUrl) return;
    
    console.log("📤 Récupération des boîtes depuis:", `${apiUrl}/get_boites.php`);

    fetch(`${apiUrl}/get_boites.php`)
      .then((res) => res.text())
      .then((rawText) => {
        console.log("📥 Réponse brute:", rawText);
        
        // Nettoyer les warnings PHP avant le JSON
        const cleanText = rawText.replace(/<br \/>\s*<b>.*?<\/b>:.*?<br \/>/gi, '').trim();
        console.log("🧹 Réponse nettoyée:", cleanText);
        
        try {
          const data = JSON.parse(cleanText);
          console.log("✅ JSON parsé:", data);
          
          if (data.success) {
            setBoites(data.boites);
            console.log("✅ Boîtes chargées:", data.boites.length);
          } else {
            console.log("⚠️ Réponse API invalide:", data);
          }
        } catch (parseError) {
          console.error("❌ Erreur parsing JSON:", parseError);
          console.error("❌ Texte reçu:", rawText);
        }
      })
      .catch((err) => {
        console.error("❌ Erreur requête:", err);
      });
  }, [apiUrl]);

  return (
    <View style={styles.home.container}>
      {/* 🔹 Header */}
      <View style={styles.home.header}>
        {role === "classique" ? (
          <View style={styles.home.inlineHeader}>
            <Text style={styles.home.groovzText}>Groov'z</Text>
            <Text style={styles.home.greetingText}>
              {"  "}{greeting} {prenom} 👋
            </Text>
          </View>
        ) : (
          <Text style={styles.home.headerTitle}>{getTitle()}</Text>
        )}
      </View>

      {/* 🔹 Liste des boîtes */}
      <Text style={styles.home.subtitle}>Boîtes autour de moi :</Text>

      <ScrollView contentContainerStyle={styles.home.scroll}>
        {boites.length === 0 ? (
          <Text style={styles.home.emptyText}>Aucune boîte disponible</Text>
        ) : (
          boites.map((boite) => (
            <TouchableOpacity
              key={boite.id}
              style={styles.home.boiteCard}
              onPress={() => navigation.navigate("BoiteDetail", { boiteId: boite.id })}
            >
              <Text style={styles.home.boiteName}>{boite.nom}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* 🔹 Barre de navigation */}
      <View style={styles.home.navbar}>
        <TouchableOpacity style={styles.home.navItem}>
          <Ionicons style={styles.home.icons} name="home-outline"  size={26}/>
          <Text style={styles.home.navText}>Accueil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.home.navItem}>
          <Ionicons style={styles.home.icons} name="chatbubbles-outline"  size={26} />
          <Text style={styles.home.navText}>Messages</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.home.navItem}>
          <Ionicons style={styles.home.icons} name="videocam-outline"  size={26} />
          <Text style={styles.home.navText}>L'Actu</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.home.navItem}
          onPress={() => navigation.navigate("Settings")}
        >
          <Ionicons style={styles.home.icons} name="person-outline" size={26}/>
          <Text style={styles.home.navText}>Profil</Text>
        </TouchableOpacity>
      </View>

      {/* 🔹 Affichage debug de l'API */}
      {apiUrl && (
        <Text style={styles.home.apiText}>🔗 API : {apiUrl}</Text>
      )}
    </View>
  );
}