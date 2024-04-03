<?php

Class Config
{
  public const DEBUG = true; 
  
  public const JWT_SECRET = "qBefq44FL7g9ujqm+tYYFSK56jzPbxLWYSLXCKAUnz79AZGuXJ9AbujWJCoVLYq6";

  // Read connection info from connectionString.json, if it doesn't exist, create it
  public static function getConnectionInfo() : array
  {
    $connectionInfo = file_get_contents(dirname(__FILE__) ."/../connectionstring.json");

    if ($connectionInfo === false)
    {
      $connectionInfo = [
        "servername" => "localhost",
        "databasename" => "web_project",
        "username" => "",
        "password" => ""
      ];

      file_put_contents("connectionString.json", json_encode($connectionInfo));

      echo self::DEBUG ? "connectionString.json created, please fill in the connection details" : "";
      exit();
    }

    return json_decode($connectionInfo, true);
  }
}
