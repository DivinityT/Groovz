<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

require_once "config.php";

// 🔹 Réponse à la pré-requête CORS (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    echo json_encode(["success" => true, "message" => "Pré-requête OK"]);
    exit;
}

try {
    // 🔹 Lecture du corps JSON
    $rawData = file_get_contents("php://input");
    if (!$rawData) {
        echo json_encode(["success" => false, "message" => "Aucune donnée reçue"]);
        exit;
    }

    $data = json_decode($rawData, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(["success" => false, "message" => "JSON invalide reçu"]);
        exit;
    }

    $id = $data['id'] ?? null;
    $nom = trim($data['nom'] ?? '');
    $prenom = trim($data['prenom'] ?? '');

    // 🔹 Vérification des champs
    if (empty($id) || empty($nom) || empty($prenom)) {
        echo json_encode(["success" => false, "message" => "Champs manquants"]);
        exit;
    }

    // 🔹 Vérifie la connexion PDO
    if (!isset($pdo)) {
        echo json_encode(["success" => false, "message" => "Erreur interne : PDO non défini"]);
        exit;
    }

    // 🔹 Exécution de la mise à jour
    $stmt = $pdo->prepare("UPDATE user SET nom = ?, prenom = ? WHERE id = ?");
    $stmt->execute([$nom, $prenom, $id]);

    // 🔹 Réponse selon le résultat
    if ($stmt->rowCount() > 0) {
        echo json_encode([
            "success" => true,
            "message" => "Profil mis à jour ✅",
            "user" => ["id" => $id, "nom" => $nom, "prenom" => $prenom]
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Aucune modification détectée"
        ]);
    }

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur serveur : " . $e->getMessage()
    ]);
}
?>
