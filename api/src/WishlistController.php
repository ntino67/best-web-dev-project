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
    /* TODO: Add modify for wishlist items here */
    $data = $this->model->get($this->id_user, $id);

    if (!$data) {
      http_response_code(404);
      echo json_encode(["message" => "Wishlist $id item not found for $this->id_user"]);
      return;
    }

    switch($method) {
    case "GET" :
      http_response_code(200);

      $requiredSkillsModel = new RequiredSkillsModel();
      $data["required_skills"] = $requiredSkillsModel->getAll($id);

      echo json_encode(["data" => $data]);
      break;
    
      case "DELETE" :
        $affectedRows = $this->model->delete($this->id_user, $id);

        echo json_encode([
          "message" => "Wishlist item $id deleted for user $this->id_user",
          "rows" => $affectedRows
        ]);

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
      
      $data = Paging::appendToResults($data);

      echo json_encode($data);
      break;
      
    case "POST":
      http_response_code(201);
      $data = (array) json_decode(file_get_contents("php://input"), true);

      $this->checkData($data, 422);

      $this->model->create($this->id_user, $data["id_internship_offer"]);

      echo json_encode([
        "message" => "Wishlist item created for user",
      ]);
      break;

    default:
      http_response_code(405);
      break;
    }
  }

  // Check data for errors
  // @param $data Data to check
  // @param $errorCode Error code to return if an error is found
  private function checkData(array $data, int $errorCode) : void
  {
    $pattern = array(
      "id_internship_offer" => DataValidator::NUMBER,
    );
    
    DataValidator::catchValidationErrors($data, $pattern, $errorCode);

    return;
  }
}
