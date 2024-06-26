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
    if (array_key_exists(0, $requestURI) && $requestURI[0]) {
      switch(array_shift($requestURI)) {

      case "wishlist":
        $controller = new WishlistController($id);
        $controller->processRequest($method, $requestURI);
        break;
      
      case "class":
        $controller = new RelatedClassController($id);
        $controller->processRequest($method, $requestURI);
        break;

      case "work_history":
          $controller = new UserWorkForController($id);
          $controller->processRequest($method, $requestURI);
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
      
      $relatedClassModel = new RelatedClassModel();
      $data["classes"] = $relatedClassModel->getAll($id);

      echo json_encode(["data" => $data]);
      break;

    case "PATCH":
        $data = json_decode(file_get_contents("php://input"), true);
        $this->checkData($data, 422);
        $rows = $this->model->update($data, $id);
        echo json_encode([
            "message" => "User edited",
            "rows" => $rows
        ]);
        break;

    case "DELETE" :
      $affectedRows = $this->model->delete($id);

      echo json_encode([
        "message" => "User $id disabled",
        "rows" => $affectedRows
      ]);

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

      $data = $this->model->getAll();

      $relatedClassModel = new RelatedClassModel();
      foreach ($data as &$user) {
        $user["classes"] = $relatedClassModel->getAll($user["id_user"]);
      }
      
      $data = Paging::appendToResults($data);

      echo json_encode($data);
      break;

    case "POST":
      http_response_code(201);
      $data = (array) json_decode(file_get_contents("php://input"), true);

      $this->checkData($data, 422);

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
  private function checkData(array $data, int $errorCode) : void
  {
    $pattern = array(
      "first_name" => DataValidator::NAME, 
      "last_name" => DataValidator::NAME,
      "email" => DataValidator::EMAIL,
      "password" => DataValidator::PASSWORD,
      "id_center" => DataValidator::NUMBER,
      "id_role" => DataValidator::NUMBER);

    DataValidator::catchValidationErrors($data, $pattern, $errorCode);

    return;
  }
}
