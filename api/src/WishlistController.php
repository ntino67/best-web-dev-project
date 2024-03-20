<?php

class WishlistController
{
  private WishlistModel $model;
  private string $id_user;

  public function __construct(string $id_user)
  {
    $this->id_user = $id_user;

    $this->model = new WishlistModel();
  }

  // Processes database requests for wishlist items 
  // @param $method http method
  // @param $requestURI Elements of the link of the request
  public function processRequest(string $method, array $requestURI) : void
  {

    if (array_key_exists(0, $requestURI) && $requestURI[0]) {
      $this->processRessourceRequest($method, $requestURI[0]);
    }
    else {
      $this->processCollectionRequest($method);
    }
  }

  // Process requests for a single wishlist item
  // @param $requestURI Elements of the link of the request
  private function processRessourceRequest(string $method, string $id) : void 
  {
    /* TODO: Add modify and delete for wishlist items here */
    $data = $this->model->get($this->id_user, $id);

    if (!$data) {
      http_response_code(404);
      echo json_encode(["message" => "Wishlist item not found"]);
      return;
    }

    switch($method) {
    case "GET" :
      http_response_code(200);

      $requiredSkillsModel = new RequiredSkillsModel();
      $data["required_skills"] = $requiredSkillsModel->getAll($id);

      echo json_encode($data);
      break;

    default:
      http_response_code(405);
      break;
    }
  }

  // Process requests for multiple wishlist items
  private function processCollectionRequest(string $method) : void
  {
    switch ($method) {
    case "GET":
      http_response_code(200);

      $data = $this->model->getAll($this->id_user);
      
      // Fetch required skills for each wishlist item
      foreach ($data as &$item) {
        $requiredSkillsModel = new RequiredSkillsModel();
        $item["required_skills"] = $requiredSkillsModel->getAll($item["id_internship_offer"]);
      }

      echo json_encode($data);
      break;

    default:
      http_response_code(405);
      break;
    }
  }
}
