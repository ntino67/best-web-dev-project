<?php

class RequiredSkillsController
{
  private RequiredSkillsModel $model;
  private string $id_internship_offer;

  public function __construct(string $id_internship_offer)
  {
    $this->id_internship_offer = $id_internship_offer;

    $this->model = new RequiredSkillsModel();
  }

  // Processes requests for required skills
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

  // Process requests for a single required skill
  // @param $requestURI Elements of the link of the request
  private function processRessourceRequest(string $method, string $id) : void 
  {
    $data = $this->model->get($this->id_internship_offer, $id);
    if (!$data) {
      http_response_code(404);
      echo json_encode(["message" => "Required skill not found"]);
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

  // Process requests for multiple required skills
  // @param $method http method
  private function processCollectionRequest(string $method) : void
  {
    switch ($method) {
    case "GET":
      http_response_code(200);
      echo json_encode($this->model->getAll($this->id_internship_offer));
      break;
    case "POST":
      $data = (array) json_decode(file_get_contents("php://input"), true);

      self::checkData($data, 422);

      $this->model->create($this->id_internship_offer, $data["id_skill"]);
      echo json_encode([
        "message" => "Required skill created",
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
  public static function checkData(array $data, $errorCode) : void
  {
    $pattern = array(
      "id_skill" => DataValidator::NUMBER
    );

    DataValidator::catchValidationErrors($data, $pattern, $errorCode);

    return;
  }
}
