<?php
require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $email = trim($_POST['email'] ?? '');
  $password = $_POST['password'] ?? '';

  $stmt = $pdo->prepare("SELECT id,email,password_hash FROM users WHERE email = ?");
  $stmt->execute([$email]);
  $user = $stmt->fetch(PDO::FETCH_ASSOC);

  if ($user && password_verify($password, $user['password_hash'])) {
    $_SESSION['user'] = ['id'=>$user['id'],'email'=>$user['email']];
    header("Location: /auth/secured.php");
    exit;
  } else {
    $error = "Fel e-post eller lösenord.";
  }
}
?>
<!DOCTYPE html><html lang="sv"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Logga in</title>
<style>
body{font-family:Arial,sans-serif;background:#0b0b0b;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0}
.card{background:rgba(255,255,255,.06);padding:24px 28px;border-radius:14px;backdrop-filter:blur(6px);min-width:320px}
input{width:100%;padding:10px 12px;border:1px solid #555;background:#111;color:#fff;border-radius:8px;margin:6px 0 12px}
button{width:100%;padding:10px 14px;border-radius:10px;border:1px solid #fff;background:transparent;color:#fff;cursor:pointer}
a{color:#9cf}.error{color:#ff8a8a;margin:6px 0 10px}
</style></head><body>
  <div class="card">
    <h2>Logga in</h2>
    <?php if (!empty($error)): ?><div class="error"><?=htmlspecialchars($error)?></div><?php endif; ?>
    <form method="post">
      <input type="email" name="email" placeholder="E-post" required>
      <input type="password" name="password" placeholder="Lösenord" required>
      <button type="submit">Logga in</button>
    </form>
    <p>Ny här? <a href="/auth/register.php">Skapa konto</a></p>
  </div>
</body></html>
