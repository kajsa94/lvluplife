<?php
session_start();

if (!isset($_SESSION['user'])) {
    // Om man försöker gå in utan att vara inloggad
    header('Location: index.html');
    exit();
}

$user = $_SESSION['user'];
?>
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard – Lvluplife</title>
  <link rel="stylesheet" href="styles.css">
  <style>
    body {
      background-color: #000;
      color: white;
      font-family: Arial, sans-serif;
      text-align: center;
      padding-top: 100px;
    }
    img {
      border-radius: 50%;
      margin-bottom: 20px;
    }
    a {
      color: #ccc;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <h1>Välkommen, <?= htmlspecialchars($user['name']) ?> 👋</h1>
  <img src="<?= htmlspecialchars($user['picture']) ?>" alt="Profilbild" width="100">
  <p><?= htmlspecialchars($user['email']) ?></p>

  <p><a href="logout.php">Logga ut</a></p>
</body>
</html>
