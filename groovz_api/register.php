<?php
ob_start();

ini_set('register_argc_argv', '0');
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

require_once __DIR__ . "/config.php";

// Nettoyer tout ce qui a été affiché avant (erreurs PHP, warnings)
ob_clean();

// Définir le header APRÈS avoir nettoyé
header("Content-Type: application/json; charset=utf-8");

ob_start();

ini_set('register_argc_argv', '0');
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

require_once __DIR__ . "/config.php";

// Nettoyer TOUT ce qui a été affiché avant
ob_clean();

// Définir le header JSON
header("Content-Type: application/json; charset=utf-8");

try {
    // 🔹 Lecture du JSON envoyé par l'application
    $rawInput = file_get_contents("php://input");
    $data = json_decode($rawInput, true);

    if (!is_array($data)) {
        echo json_encode(["success" => false, "message" => "Format JSON invalide ou vide"]);
        exit;
    }

    if (empty($data['prenom']) || empty($data['nom']) || empty($data['mail']) || empty($data['mdp'])) {
        echo json_encode(["success" => false, "message" => "Champs manquants"]);
        exit;
    }

    $prenom = trim($data['prenom']);
    $nom = trim($data['nom']);
    $mail = trim($data['mail']);
    $mdp = trim($data['mdp']);
    $role = "classique"; // rôle forcé

    // 🔸 Vérifie si un utilisateur existe déjà avec cet email
    $check = $pdo->prepare("SELECT id FROM user WHERE mail = ?");
    $check->execute([$mail]);

    if ($check->fetch()) {
        echo json_encode(["success" => false, "message" => "Un compte existe déjà avec cet email"]);
        exit;
    }

    // 🔸 Hash du mot de passe
    $hashed = password_hash($mdp, PASSWORD_DEFAULT);

    // 🔸 Insertion du nouvel utilisateur
    $stmt = $pdo->prepare("INSERT INTO user (prenom, nom, mail, mdp, role) VALUES (?, ?, ?, ?, ?)");
    $success = $stmt->execute([$prenom, $nom, $mail, $hashed, $role]);

    if ($success) {
        $userId = $pdo->lastInsertId();
        
        echo json_encode([
            "success" => true,
            "message" => "Inscription réussie 🎉",
            "id" => $userId,
            "prenom" => $prenom,
            "nom" => $nom,
            "mail" => $mail,
            "role" => $role
        ], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(["success" => false, "message" => "Erreur lors de l'inscription"]);
    }

} catch (PDOException $e) {
    ob_clean();
    header("Content-Type: application/json; charset=utf-8");
    
    echo json_encode([
        "success" => false,
        "message" => "Erreur serveur"
    ]);
}

ob_end_flush();
?>