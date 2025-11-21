<?php
ini_set('register_argc_argv', '0');
$host = "groovznadm.mysql.db";
$dbname = "groovznadm";
$username = "groovznadm";
$password = "Test12345";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    header("Content-Type: application/json");
    die(json_encode(["success" => false, "message" => "Erreur DB"]));
}
