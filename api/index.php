<?php

declare(strict_types=1);

// Automatically load classes defined in src/
spl_autoload_register(function($class) {
  require __DIR__ . "/src/$class.php";  
});

// Load php dependencies
require_once(__DIR__ . "/vendor/autoload.php");

// Set content type to json and define charset
header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: *");


// Allow CORS
header("Access-Control-Allow-Origin: *");

// Set Error and Exception handlers
set_error_handler("ErrorHandler::handleError");
set_exception_handler("ErrorHandler::handleException");

// Remove the querystring, separate the URI into parts and put into an array
$requestURI = explode("/", explode("?", $_SERVER["REQUEST_URI"])[0]);

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

$controller = new AuthController;

// ## Authentification ##
// Auth endpoint
if ($requestURI[0] == "auth")
{
  $controller->authenticateUser($_SERVER['REQUEST_METHOD']);

  exit();
}
else if (!array_key_exists("HTTP_AUTHORIZATION_TOKEN", $_SERVER)|| !$controller->verifyToken($_SERVER["HTTP_AUTHORIZATION_TOKEN"]))
{
  http_response_code(401);
  echo json_encode(["message" => "Unauthorized"]);
  exit();
}


// ## API Endpoints ##
// Process request type, send to corrent API endpoint
$id_company = null;
switch (array_shift($requestURI)) {
case "city":
  $controller = new CityController;
  $controller->processRequest($_SERVER['REQUEST_METHOD'], $requestURI);
  break;

case "center":
  $controller = new CenterController;
  $controller->processRequest($_SERVER['REQUEST_METHOD'], $requestURI);
  break;

case "user":
  $controller = new UserController;
  $controller->processRequest($_SERVER['REQUEST_METHOD'], $requestURI);
  break;

case "internship":
  $controller = new InternshipOfferController;
  $controller->processRequest($_SERVER['REQUEST_METHOD'], $requestURI);
  break;

case "skill":
  $controller = new SkillController;
  $controller->processRequest($_SERVER['REQUEST_METHOD'], $requestURI);
  break;

case "business-sector":
  $controller = new BusinessSectorController;
  $controller->processRequest($_SERVER['REQUEST_METHOD'], $requestURI);
  break;

case "company":
  $controller = new CompanyController;
  $controller->processRequest($_SERVER['REQUEST_METHOD'], $requestURI);
  break;

case "role":
  $controller = new RoleController;
  $controller->processRequest($_SERVER['REQUEST_METHOD'], $requestURI);
  break;

case "stat":
  $controller = new StatController;
  $controller->processRequest($_SERVER['REQUEST_METHOD'], $requestURI);
  break;

    case "rating":
        if (!empty($requestURI[0])) {
            $id_company = (string)$requestURI[0];
            $controller = new CompanyReviewController($id_company);
        } else {
            $controller = new CompanyReviewController("0");
        }
        $controller->processRequest($_SERVER['REQUEST_METHOD'], $requestURI);
        break;

  // TODO: Add more request types here

default:
  http_response_code(404);
  break;
}
