<?php
// Version ultra-propre avec ob_start
@ini_set('register_argc_argv', '0');
@ini_set('display_errors', '0');
@error_reporting(0);

ob_start();

try {
    require_once __DIR__ . "/config.php";
} catch (Exception $e) {
    ob_end_clean();
    header("Content-Type: application/json");
    die(json_encode(["success" => false, "message" => "Erreur config"]));
}

ob_end_clean();
ob_start();

header("Content-Type: application/json");

// Gérer preflight CORS (optionnel)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

try {
    // Lire le JSON d'entrée
    $raw = @file_get_contents("php://input");
    
    if (!$raw) {
        ob_end_clean();
        http_response_code(400);
        die(json_encode(["success" => false, "message" => "Corps de requete vide"]));
    }

    $data = @json_decode($raw, true);
    
    if (!is_array($data)) {
        ob_end_clean();
        http_response_code(400);
        die(json_encode(["success" => false, "message" => "JSON invalide"]));
    }

    $id     = isset($data['id']) ? (int)$data['id'] : 0;
    $nom    = isset($data['nom']) ? trim($data['nom']) : '';
    $prenom = isset($data['prenom']) ? trim($data['prenom']) : '';

    if ($id <= 0 || $nom === '' || $prenom === '') {
        ob_end_clean();
        http_response_code(422);
        die(json_encode(["success" => false, "message" => "Champs manquants"]));
    }

    // Vérifier que l'utilisateur existe
    $stmt = $pdo->prepare("SELECT id, nom, prenom FROM user WHERE id = ?");
    $stmt->execute([$id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        ob_end_clean();
        http_response_code(404);
        die(json_encode(["success" => false, "message" => "Utilisateur introuvable"]));
    }

    // Si identique, pas besoin de modifier
    if ($user['nom'] === $nom && $user['prenom'] === $prenom) {
        ob_end_clean();
        echo json_encode([
            "success" => true,
            "message" => "Aucune modification (profil inchange)",
            "user"    => ["id" => $id, "nom" => $nom, "prenom" => $prenom]
        ]);
        exit;
    }

    // Mettre à jour
    $stmt = $pdo->prepare("UPDATE user SET nom = ?, prenom = ? WHERE id = ?");
    $stmt->execute([$nom, $prenom, $id]);

    ob_end_clean();
    echo json_encode([
        "success" => true,
        "message" => "Profil mis a jour",
        "user"    => ["id" => $id, "nom" => $nom, "prenom" => $prenom]
    ]);

} catch (Exception $e) {
    ob_end_clean();
    http_response_code(500);
    die(json_encode([
        "success" => false,
        "message" => "Erreur serveur"
    ]));
}