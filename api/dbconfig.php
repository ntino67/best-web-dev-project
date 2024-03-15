<?php
global $conn;

$connectionString = file_get_contents("connectionstring.json");

$connectionString = json_decode($connectionString);

$servername = $connectionString->servername;
$username = $connectionString->username;
$password = $connectionString->password;
$databasename = $connectionString->databasename;

try {
     $conn = new PDO("mysql:host=$servername;dbname=$databasename;charset=utf8mb4", $username, $password);
}
catch (Exception $e) {
  $message = $e->getMessage();
  echo "DB connection failed $message";
}
