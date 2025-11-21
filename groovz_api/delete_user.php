<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once "config.php";
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'] ?? null;

    if (!$id) {
        echo json_encode(["success" => false, "message" => "Identifiant manquant"]);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM user WHERE id = ?");
    $stmt->execute([$id]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["success" => true, "message" => "Compte supprimé avec succès"]);
    } else {
        echo json_encode(["success" => false, "message" => "Aucun compte trouvé avec cet ID"]);
    }
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Erreur serveur : " . $e->getMessage()
    ]);
}
?>
