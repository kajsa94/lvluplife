<?php
require __DIR__ . '/config.php';
if (empty($_SESSION['user'])) { header("Location: /auth/login.php"); exit; }
$user = $_SESSION['user'];
?>
<!DOCTYPE html><html lang="sv"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Mitt konto</title>
<style>body{font-family:Arial,sans-serif;background:#000;color:#fff;margin:0;padding:40px}a{color:#9cf}</style>
</head><body>
  <h1>Hej <?=htmlspecialchars($user['email'])?></h1>
  <p>Du är inloggad 🎉</p>
  <p><a href="/auth/logout.php">Logga ut</a></p>
</body></html>
