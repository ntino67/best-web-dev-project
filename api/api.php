<?php

declare(strict_types=1);

// Automatically load classes defined in src/
spl_autoload_register(function($class) {
  require __DIR__ . "/src/$class.php";  
});

// Set Error and Exception handlers
set_error_handler("ErrorHandler::handleError");
set_exception_handler("ErrorHandler::handleException");

// Set content type to json and define charset
header('Content-Type: application/json; charset=utf-8');

// Separate the URI into parts and put into array
$requestURI = explode("/", $_SERVER["REQUEST_URI"]);

// Only keep the part of the URI that comes after api/
while (true) {
  if (sizeof($requestURI) == 0) {
    http_response_code(500);
    exit();
  }

  if (array_shift($requestURI) == "api") {
    break;
  }
}

// Process request type 
switch (array_shift($requestURI)) {
case "city":
  $controller = new CityController;
  $controller->processRequest($_SERVER['REQUEST_METHOD'], $requestURI);

case "user":
  $controller = new UserController;
  $controller->processRequest($_SERVER['REQUEST_METHOD'], $requestURI);
  // Add more request types here

default:
  http_response_code(404);
  exit();
}
