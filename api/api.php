<?php

global $conn;
require_once "dbconfig.php";

$parts = explode("/", $_SERVER["REQUEST_URI"]);

header('Content-Type: application/json; charset=utf-8');

if($parts[2] == "city") {
  // PDO::FETCH_ASSOC to fetch only the associative array or PDO::FETCH_NUM to fetch only the numeric array.
  if(($parts[3] ?? null) == null) {
    $response = $conn->query("SELECT Cities.id_city, Cities.name AS city_name, C.name AS country_name FROM web_project.Cities JOIN web_project.Country C on C.id_country = Cities.id_country")->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($response);

  }
  else if (is_numeric($parts[3])) {
    $id = $parts[3];
    $response = $conn->query("SELECT Cities.id_city, Cities.name AS city_name, C.name AS country_name FROM web_project.Cities JOIN web_project.Country C on C.id_country = Cities.id_country WHERE id_city = $id")->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($response);
  }
  else {
    http_response_code(400);
  }
}
else {
  http_response_code(404);
}




