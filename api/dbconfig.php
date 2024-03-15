<?php
global $conn;
$servername = "localhost";
$username = "root";
$password = "kellian";
$databasename = "web_project";

try {
     $conn = new PDO("mysql:host=$servername;dbname=$databasename;charset=utf8mb4", $username, $password);
}
catch (Exception $e) {
  $message = $e->getMessage;
  echo "DB connection failed $message";
}

?>
