<?php
// Version ultra-simplifiée (comme register.php)
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

if (PHP_SAPI === 'cli' && isset($argv[1])) {
    $rawInput = $argv[1];
} else {
    $rawInput = file_get_contents("php://input");
}

$rawInput = @file_get_contents("php://input");
$data = @json_decode($rawInput, true);

if (!$data || !isset($data['mail']) || !isset($data['mdp'])) {
    ob_end_clean();
    die(json_encode(["success" => false, "message" => "Champs manquants"]));
}

$mail = trim($data['mail']);
$mdp = trim($data['mdp']);

try {
    $stmt = $pdo->prepare("SELECT id, prenom, nom, mail, mdp, role FROM user WHERE mail = ?");
    $stmt->execute([$mail]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        ob_end_clean();
        die(json_encode(["success" => false, "message" => "Utilisateur introuvable"]));
    }

    if (password_verify($mdp, $user['mdp'])) {
        ob_end_clean();
        echo json_encode([
            "success" => true,
            "message" => "Connexion reussie",
            "id" => $user['id'],
            "prenom" => $user['prenom'],
            "nom" => $user['nom'],
            "mail" => $user['mail'],
            "role" => $user['role']
        ]);
    } else {
        ob_end_clean();
        die(json_encode(["success" => false, "message" => "Mot de passe incorrect"]));
    }

} catch (Exception $e) {
    ob_end_clean();
    die(json_encode(["success" => false, "message" => "Erreur serveur"]));
}
?>