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

if (!isset($_GET['id'])) {
    ob_end_clean();
    die(json_encode(["success" => false, "message" => "Parametre 'id' manquant"]));
}

$id = intval($_GET['id']);

try {
    // Récupérer la boîte
    $stmt = $pdo->prepare("SELECT id, nom, adresse, instagram, site_web, image_path FROM boites WHERE id = ?");
    $stmt->execute([$id]);
    $boite = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$boite) {
        ob_end_clean();
        die(json_encode(["success" => false, "message" => "Boite introuvable"]));
    }

    // Récupérer les horaires
    $stmt2 = $pdo->prepare("SELECT jour, ouverture, fermeture FROM horaires WHERE boite_id = ?");
    $stmt2->execute([$id]);
    $rows = $stmt2->fetchAll(PDO::FETCH_ASSOC);

    $horaires = [];
    foreach ($rows as $row) {
        $jour = strtolower($row['jour']);
        $horaires[$jour] = [
            "ouverture" => substr($row['ouverture'], 0, 5),
            "fermeture" => substr($row['fermeture'], 0, 5)
        ];
    }

    $boite["horaires"] = $horaires;

    ob_end_clean();
    echo json_encode([
        "success" => true,
        "boite" => $boite
    ]);

} catch (PDOException $e) {
    ob_end_clean();
    die(json_encode([
        "success" => false,
        "message" => "Erreur serveur"
    ]));
}