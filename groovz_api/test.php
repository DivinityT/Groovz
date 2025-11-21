<?php
// ⚠️ VERSION DEBUG - À SUPPRIMER APRÈS TEST

ob_start();

ini_set('register_argc_argv', '0');
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

$debug = [];
$debug[] = "✅ 1. Script démarré";

try {
    require_once __DIR__ . "/config.php";
    $debug[] = "✅ 2. Config.php chargé";
} catch (Exception $e) {
    $debug[] = "❌ 2. Erreur config.php : " . $e->getMessage();
}

ob_clean();

header("Content-Type: application/json; charset=utf-8");
$debug[] = "✅ 3. Headers JSON envoyés";

try {
    // 🔹 Lecture du JSON
    $rawInput = file_get_contents("php://input");
    $debug[] = "✅ 4. Raw input lu : " . substr($rawInput, 0, 100);
    
    $data = json_decode($rawInput, true);
    $debug[] = "✅ 5. JSON décodé : " . print_r($data, true);

    if (!is_array($data)) {
        $debug[] = "❌ 6. Data n'est pas un array";
        echo json_encode([
            "success" => false, 
            "message" => "Format JSON invalide",
            "debug" => $debug,
            "raw_input" => $rawInput
        ]);
        exit;
    }

    $debug[] = "✅ 6. Data est un array valide";

    // Vérification des champs
    $missingFields = [];
    if (empty($data['prenom'])) $missingFields[] = 'prenom';
    if (empty($data['nom'])) $missingFields[] = 'nom';
    if (empty($data['mail'])) $missingFields[] = 'mail';
    if (empty($data['mdp'])) $missingFields[] = 'mdp';

    if (!empty($missingFields)) {
        $debug[] = "❌ 7. Champs manquants : " . implode(', ', $missingFields);
        echo json_encode([
            "success" => false,
            "message" => "Champs manquants",
            "missing" => $missingFields,
            "received" => array_keys($data),
            "debug" => $debug
        ]);
        exit;
    }

    $debug[] = "✅ 7. Tous les champs présents";

    $prenom = trim($data['prenom']);
    $nom = trim($data['nom']);
    $mail = trim($data['mail']);
    $mdp = trim($data['mdp']);
    $role = "classique";

    $debug[] = "✅ 8. Variables extraites : prenom=$prenom, nom=$nom, mail=$mail";

    // 🔸 Vérification si l'utilisateur existe
    $debug[] = "✅ 9. Vérification de l'email dans la BDD...";
    $check = $pdo->prepare("SELECT id FROM user WHERE mail = ?");
    $check->execute([$mail]);

    if ($check->fetch()) {
        $debug[] = "❌ 10. Email déjà utilisé";
        echo json_encode([
            "success" => false,
            "message" => "Un compte existe déjà avec cet email",
            "debug" => $debug
        ]);
        exit;
    }

    $debug[] = "✅ 10. Email disponible";

    // 🔸 Hash du mot de passe
    $debug[] = "✅ 11. Hashage du mot de passe...";
    $hashed = password_hash($mdp, PASSWORD_DEFAULT);
    $debug[] = "✅ 12. Hash créé : " . substr($hashed, 0, 20) . "...";

    // 🔸 Insertion
    $debug[] = "✅ 13. Insertion dans la BDD...";
    $stmt = $pdo->prepare("INSERT INTO user (prenom, nom, mail, mdp, role) VALUES (?, ?, ?, ?, ?)");
    $success = $stmt->execute([$prenom, $nom, $mail, $hashed, $role]);

    if ($success) {
        $userId = $pdo->lastInsertId();
        $debug[] = "✅ 14. Utilisateur créé avec l'ID : $userId";
        
        echo json_encode([
            "success" => true,
            "message" => "Inscription réussie 🎉",
            "id" => $userId,
            "prenom" => $prenom,
            "nom" => $nom,
            "mail" => $mail,
            "role" => $role,
            "debug" => $debug
        ], JSON_UNESCAPED_UNICODE);
    } else {
        $debug[] = "❌ 14. Échec de l'insertion";
        echo json_encode([
            "success" => false,
            "message" => "Erreur lors de l'insertion",
            "debug" => $debug
        ]);
    }

} catch (PDOException $e) {
    $debug[] = "❌ ERREUR PDO : " . $e->getMessage();
    ob_clean();
    header("Content-Type: application/json; charset=utf-8");
    
    echo json_encode([
        "success" => false,
        "message" => "Erreur serveur",
        "error" => $e->getMessage(),
        "debug" => $debug
    ]);
} catch (Exception $e) {
    $debug[] = "❌ ERREUR : " . $e->getMessage();
    ob_clean();
    header("Content-Type: application/json; charset=utf-8");
    
    echo json_encode([
        "success" => false,
        "message" => "Erreur",
        "error" => $e->getMessage(),
        "debug" => $debug
    ]);
}

ob_end_flush();
?>