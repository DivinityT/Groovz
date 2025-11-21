import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import useLocalAPI from "../hooks/useLocalAPI";
import { useAppTheme } from "./ThemeContext";

export default function BoiteDetail() {
  const { styles, colors } = useAppTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const { boiteId } = route.params;

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showHoraires, setShowHoraires] = useState(false);

  const API_URL = useLocalAPI();

  useEffect(() => {
    if (!API_URL) return;

    const fetchDetails = async () => {
      try {        
        const res = await fetch(`${API_URL}/get_boite_details.php?id=${boiteId}`);
        const rawText = await res.text();
        
        
        // Nettoyer les warnings PHP
        const cleanText = rawText.replace(/<br \/>\s*<b>.*?<\/b>:.*?<br \/>/gi, '').trim();
        
        try {
          const data = JSON.parse(cleanText);
          console.log("✅ JSON parsé:", data);
          
          if (data.success) {
            setDetails(data.boite);
          } else {
          }
        } catch (parseError) {
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [API_URL, boiteId]);

  if (loading) {
    return (
      <View style={[styles.details.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!details) {
    return (
      <View style={styles.details.container}>
        <Text style={{ color: "#fff", textAlign: "center", marginTop: 50 }}>
          Impossible de charger les informations 😢
        </Text>
      </View>
    );
  }

  const openMap = () => {
    if (!details.adresse) return;
    const query = encodeURIComponent(details.adresse);
    const url = Platform.select({
      ios: `http://maps.apple.com/?q=${query}`,
      android: `geo:0,0?q=${query}`,
    });
    Linking.openURL(url);
  };

  const openLink = (url) => {
    if (url) Linking.openURL(url);
  };

  const openReviews = () => {
    const url = `https://www.google.com/search?q=${encodeURIComponent(details.nom + " avis")}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.details.container}>
      {/* 🔹 Header */}
      <View style={styles.details.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.details.backButton}>
          <Ionicons name="chevron-back-outline" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.details.headerTitle}>Groov'z</Text>
      </View>

      <ScrollView contentContainerStyle={styles.details.scroll}>
        {/* 🖼️ Image */}
        {details.image_path && (
          <Image
            source={{ uri: `${API_URL}/${details.image_path}` }}
            style={styles.details.image}
          />
        )}

        {/* 🏷️ Nom */}
        <Text style={styles.details.boiteName}>{details.nom}</Text>

        {/* 📍 Adresse */}
        {details.adresse && (
          <TouchableOpacity onPress={openMap}>
            <View style={styles.details.card}>
              <Ionicons name="location-outline" size={22} color="#6F3FCC" />
              <Text style={styles.details.cardText}>{details.adresse}</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* 🌐 Site web */}
        {details.site_web && (
          <TouchableOpacity onPress={() => openLink(details.site_web)}>
            <View style={styles.details.card}>
              <Ionicons name="globe-outline" size={22} color="#6F3FCC" />
              <Text style={styles.details.cardText}>Site web</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* 📸 Instagram */}
        {details.instagram && (
          <TouchableOpacity onPress={() => openLink(details.instagram)}>
            <View style={styles.details.card}>
              <Ionicons name="logo-instagram" size={22} color="#E1306C" />
              <Text style={styles.details.cardText}>Voir sur Instagram</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* ⭐ Avis Google */}
        <TouchableOpacity onPress={openReviews}>
          <View style={styles.details.card}>
            <Ionicons name="star" size={22} color="#FFD700" />
            <Text style={styles.details.cardText}>Voir les avis sur Google</Text>
          </View>
        </TouchableOpacity>

        {/* 🕒 Horaires */}
        <TouchableOpacity
          style={styles.details.toggle}
          onPress={() => setShowHoraires(!showHoraires)}
        >
          <Text style={styles.details.toggleText}>
            {showHoraires ? "Masquer les horaires" : "Voir les horaires"}
          </Text>
          <Ionicons
            name={showHoraires ? "chevron-up-outline" : "chevron-down-outline"}
            size={18}
            color="#fff"
          />
        </TouchableOpacity>

        {showHoraires && details.horaires && (
          <View style={styles.details.horairesCard}>
            {Object.entries(details.horaires).map(([jour, horaire]) => (
              <View key={jour} style={styles.details.horaireRow}>
                <Text style={styles.details.jourText}>
                  {jour.charAt(0).toUpperCase() + jour.slice(1)}
                </Text>
                <Text style={styles.details.plageText}>
                  {horaire.ouverture && horaire.fermeture
                    ? `${horaire.ouverture} → ${horaire.fermeture}`
                    : "Fermé"}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}