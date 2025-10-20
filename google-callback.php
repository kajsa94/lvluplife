<?php
require_once 'vendor/autoload.php';
session_start();

$client = new Google_Client();
$client->setClientId('400799456353-6pij15sa1ontmij4j1tvpfqtp9u...apps.googleusercontent.com');
$client->setClientSecret('DIN_CLIENT_SECRET');
$client->setRedirectUri('https://lvluplife.org/google-callback.php');

if (isset($_GET['code'])) {
    $token = $client->fetchAccessTokenWithAuthCode($_GET['code']);
    $client->setAccessToken($token);

    $oauth = new Google_Service_Oauth2($client);
    $userInfo = $oauth->userinfo->get();

    // Spara användarinfo i session (eller databas om du vill)
    $_SESSION['user'] = [
        'id' => $userInfo->id,
        'name' => $userInfo->name,
        'email' => $userInfo->email,
        'picture' => $userInfo->picture
    ];

    header('Location: dashboard.php'); // sida användaren kommer till efter inloggning
    exit();
} else {
    echo "Ingen kod mottagen från Google.";
}
?>
