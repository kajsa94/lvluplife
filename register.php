<?php
require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $email = trim($_POST['email'] ?? '');
  $password = $_POST['password'] ?? '';

  if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 6) {
    $error = "Ogiltig e-post eller för kortt lösenord (minst 6 tecken).";
  } else {
    try {
      $hash = password_hash($password, PASSWORD_DEFAULT);
      $stmt = $pdo->prepare("INSERT INTO users (email, password_hash) VALUES (?, ?)");
      $stmt->execute([$email, $hash]);
      $_SESSION['user'] = ['email' => $email];
      header("Location: /auth/secured.php");
      exit;
    } catch (PDOException $e) {
      if ($e->getCode() === '23000') $error = "E-posten finns redan.";
      else $error = "Fel: " . $e->getMessage();
    }
  }
}
?>
<!DOCTYPE html><html lang="sv"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Registrera</title>
<style>
body{font-family:Arial,sans-serif;background:#0b0b0b;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0}
.card{background:rgba(255,255,255,.06);padding:24px 28px;border-radius:14px;backdrop-filter:blur(6px);min-width:320px}
input{width:100%;padding:10px 12px;border:1px solid #555;background:#111;color:#fff;border-radius:8px;margin:6px 0 12px}
button{width:100%;padding:10px 14px;border-radius:10px;border:1px solid #fff;background:transparent;color:#fff;cursor:pointer}
a{color:#9cf}.error{color:#ff8a8a;margin:6px 0 10px}
</style></head><body>
  <div class="card">
    <h2>Skapa konto</h2>
    <?php if (!empty($error)): ?><div class="error"><?=htmlspecialchars($error)?></div><?php endif; ?>
    <form method="post">
      <input type="email" name="email" placeholder="E-post" required>
      <input type="password" name="password" placeholder="Lösenord (minst 6 tecken)" required>
      <button type="submit">Registrera</button>
    </form>
    <p>Har du konto? <a href="/auth/login.php">Logga in</a></p>
  </div>
</body></html>
