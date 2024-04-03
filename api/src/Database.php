<?php

class Database
{
  private static ?PDO $conn = null;

  private static function createConnection() : void
  {
    $connInfo = Config::getConnectionInfo(); 

    $servername = $connInfo["servername"];
    $username = $connInfo["username"];
    $password = $connInfo["password"];
    $databasename = $connInfo["databasename"];

    $dsn = "mysql:host=$servername;dbname=$databasename;charset=utf8mb4";

    self::$conn = new PDO($dsn, $username, $password, [
      PDO::ATTR_EMULATE_PREPARES => false,
      PDO::ATTR_STRINGIFY_FETCHES =>false
    ]);
  }

  public static function getConnection() : PDO
  {
    if (self::$conn === null) { self::createConnection(); }

    return self::$conn;
  }
}
