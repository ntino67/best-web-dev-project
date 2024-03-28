<?php

class RelatedClassController 
{
  private RelatedClassModel $model;
  private string $id_user;

  public function __construct(string $id_user)
  {
    $this->id_user = $id_user;

    $this->model = new RelatedClassModel();
  }

  // Processes requests for a user's related classes
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

  // Process requests for a single related class
  // @param $requestURI Elements of the link of the request
  private function processRessourceRequest(string $method, string $id) : void 
  {
    $data = $this->model->get($this->id_user, $id);

    if (!$data) {
      http_response_code(404);
      echo json_encode(["message" => "Related class $id not found for user $this->id_user"]);
      return;
    }
    
    switch($method) {
    case "GET" :
      http_response_code(200);
      echo json_encode($data);

    case "DELETE" :
      $affectedRows = $this->model->delete($this->id_user, $id);

      echo json_encode([
        "message" => "Related class $id deleted for user $this->id_user",
        "rows" => $affectedRows
      ]);

      break;
    default:
      http_response_code(405);
      break;
    }
  }
  
  private function processCollectionRequest(string $method) : void
  {
    switch($method) {
    case "GET" :
      $data = $this->model->getAll($this->id_user);

      http_response_code(200);

      echo json_encode($data);

      break;

    case "POST" :
      http_response_code(201);
      $data = (array) json_decode(file_get_contents("php://input"));
      
      $this->checkData($data, 422);

      $this->model->create($this->id_user, $data["id_class"]);

      echo json_encode([
        "message" => "Related class created for user"
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
      "id_class" => DataValidator::NUMBER,
    );
    
    DataValidator::catchValidationErrors($data, $pattern, $errorCode);

    return;
  }
}
