<?php

class Database
{
  public static function getConnection() : PDO
  {
    $connectionString = file_get_contents(dirname(__FILE__) ."/../connectionstring.json");
    
    $connectionString = json_decode($connectionString);
    
    $servername = $connectionString->servername;
    $username = $connectionString->username;
    $password = $connectionString->password;
    $databasename = $connectionString->databasename;


    $dsn = "mysql:host=$servername;dbname=$databasename;charset=utf8mb4";

    return new PDO($dsn, $username, $password, [
      PDO::ATTR_EMULATE_PREPARES => false,
      PDO::ATTR_STRINGIFY_FETCHES =>false
    ]);
  }
}
