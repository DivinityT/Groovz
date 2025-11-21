<?php
header("Content-Type: application/json; charset=utf-8");

$host = "groovznadm.mysql.db";
$dbname = "groovznadm";
$username = "groovznadm";
$password = "Test12345"; // ⚠️ remplace ici par ton vrai mot de passe SQL

try {
    // Connexion à la base
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Requête test
    $stmt = $pdo->query("SELECT prenom, nom, role FROM user");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Réponse JSON
    echo json_encode([
        "success" => true,
        "message" => "Connexion réussie ✅",
        "nb_users" => count($users),
        "users" => $users
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Erreur connexion BDD ❌",
        "error" => $e->getMessage()
    ]);
}
?>
