<?php

class UserController
{
  private UserModel $model;

  public function __construct()
  {
    $this->model = new UserModel();
  }

  // Processes requests for users 
  // @param $method http method
  // @param $requestURI Elements of the link of the request
  public function processRequest(string $method, array $requestURI) : void
  {
    if (array_key_exists(0, $requestURI) && $requestURI[0]) {
      $this->processRessourceRequest($method, $requestURI);
    }
    else {
      $this->processCollectionRequest($method);
    }
  }

  // Process requests for a single user
  // @param $requestURI Elements of the link of the request
  private function processRessourceRequest(string $method, array $requestURI) : void 
  {
    $id = array_shift($requestURI);

    // Check if the user exists and fetch his data, if not return 404
    $data = $this->model->get($id);

    if (!$data) {
      http_response_code(404);
      echo json_encode(["message" => "User not found"]);
      return;
    }

    // If the users wishlist or work history requested
    if (array_key_exists(0, $requestURI)) {
      switch(array_shift($requestURI)) {

      case "wishlist":
        $controller = new WishlistController($id);
        $controller->processRequest($method, $requestURI);
        break;

      case "work_history":
        // TODO: Implement this
        break;

      default:
        http_response_code(404);
        break;
      }
      return;
    }

    // If the request is for the user itself
    switch($method) {
    case "GET" :
      http_response_code(200);
      echo json_encode(["data" => $data]);
      break;

    default:
      http_response_code(405);
      break;
    }
  }

  // Process requests for multiple users
  private function processCollectionRequest(string $method) : void
  {
    switch ($method) {
    case "GET":
      http_response_code(200);
      $data = Paging::appendToResults($this->model->getAll());
      echo json_encode($data);
      break;

    case "POST":
      http_response_code(201);
      $data = (array) json_decode(file_get_contents("php://input"), true);

      $this->getValidationErrors($data, 422);

      $id = $this->model->create($data);

      echo json_encode([
        "message" => "User created",
        "id" => $id
      ]);
      break;

    default:
      http_response_code(405);
      break;
    }
  }

  // Check data for errors
  // @param $data Data to check
  private function getValidationErrors(array $data, int $errorCode) : void
  {
    $errors = array();

    $string_data = array(
      "first_name" => "/^[a-z ,.'-]+$/i", 
      "last_name" => "/^[a-z ,.'-]+$/i", 
      "email" => "/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/", 
      "password" => "/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/");

    $int_data = array(
      "id_center",
      "id_role");

    $errors = array_merge(
      DataValidator::getStringErrors($data, $string_data),
      DataValidator::getIntegerErrors($data, $int_data)
    );

    if (!empty($errors))
    {
      http_response_code($errorCode);
      echo json_encode(["errors" => $errors]);
      exit(); 
    }
    return;
  }
}
