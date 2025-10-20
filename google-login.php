<?php
require_once 'vendor/autoload.php'; // eller var du har google-klienten

session_start();

$client = new Google_Client();
$client->setClientId('400799456353-6pij15sa1ontmij4j1tvpfqtp9u...apps.googleusercontent.com'); // <-- ditt Client ID
$client->setClientSecret('400799456353-6pij15sa1ontmi4j1tvpfqtp9uudb4ub.apps.googleusercontent.com'); // den hittar du också under "Clients"
$client->setRedirectUri('https://lvluplife.org/google-callback.php');
$client->addScope('email');
$client->addScope('profile');

$authUrl = $client->createAuthUrl();
header('Location: ' . $authUrl);
exit();
?>
