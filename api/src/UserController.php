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

    $data = $this->model->get($id);

    if (!$data) {
      http_response_code(404);
      echo json_encode(["message" => "User not found"]);
      return;
    }
    
    // If the wishlist or work history is requested
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

    switch($method) {
    case "GET" :
      http_response_code(200);
      echo json_encode($data);
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
      echo json_encode($this->model->getAll());
      break;

    default:
      http_response_code(405);
      break;
    }
  }
}
