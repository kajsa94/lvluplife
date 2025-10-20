<?php
$DB_HOST = "127.0.0.1";
$DB_NAME = "lvlup";
$DB_USER = "lvlupuser";
$DB_PASS = "Drogtabletter1!"; // byt om du ändrat

try {
  $pdo = new PDO(
    "mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4",
    $DB_USER,
    $DB_PASS,
    [ PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION ]
  );
} catch (PDOException $e) {
  http_response_code(500);
  echo "DB error: " . htmlspecialchars($e->getMessage());
  exit;
}
session_start();
