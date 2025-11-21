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

try {
    $stmt = $pdo->query("SELECT * FROM boites");
    $boites = $stmt->fetchAll(PDO::FETCH_ASSOC);

    ob_end_clean();
    echo json_encode([
        "success" => true,
        "boites" => $boites
    ]);

} catch (PDOException $e) {
    ob_end_clean();
    die(json_encode([
        "success" => false,
        "message" => "Erreur BDD"
    ]));
}