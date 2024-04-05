<?php

class InternshipOfferController
{
  private InternshipOfferModel $model;

  public function __construct()
  {
    $this->model = new InternshipOfferModel();
  }

  // Processes requests for Internship offers
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

  // Process requests for a single Internship offer 
  // @param $requestURI Elements of the link of the request
  private function processRessourceRequest(string $method, array $requestURI) : void 
  {
    $id = array_shift($requestURI);

    $data = $this->model->get($id);

    if (!$data) {
      http_response_code(404);
      echo json_encode(["message" => "Internship not found"]);
      return;
    }
    
    // If the required skills are requested
    if (array_key_exists(0, $requestURI) && $requestURI[0]) {
      switch(array_shift($requestURI)) {
      case "required_skill":
        $controller = new RequiredSkillsController($id);
        $controller->processRequest($method, $requestURI);
        break;

      case "applications":
          $controller = new ApplicationForInternshipOfferController($id);
          $controller->processRequest($method, $requestURI);
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

      $requiredSkillsModel = new RequiredSkillsModel();
      $data["required_skills"] = $requiredSkillsModel->getAll($id);

      echo json_encode(["data" => $data]);
      break;
      case "PATCH":
          $data = json_decode(file_get_contents("php://input"), true);

          $this->getValidationErrors($data, 422);

          $rows = $this->model->update($data, $id);

          echo json_encode([
              "message" => "Internship offer edited",
              "rows" => $rows
          ]);

          break;


    case "DELETE" :
      $affectedRows = $this->model->delete($id);

      echo json_encode([
      "message" => "Internship $id deleted",
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

      // Add required skills to each item
      $requiredSkillsModel = new RequiredSkillsModel();

      foreach ($data as &$item) {
        $item["required_skills"] = $requiredSkillsModel->getAll($item["id_internship_offer"]);
      }

      // Add paging data
      $data = Paging::appendToResults($data);

      echo json_encode($data);
      break;

    case "POST":
      http_response_code(201);

      $data = (array) json_decode(file_get_contents("php://input"), true);

      $this->getValidationErrors($data, 422);

      $id = $this->model->create($data);

      echo json_encode([
        "message" => "Internship created",
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
    $pattern = array(
      "internship_offer_title" => DataValidator::NAME, 
      "internship_offer_description" => DataValidator::NOT_EMPTY,
      "internship_offer_created_at" => DataValidator::DATE,
      "internship_offer_expires_at" => DataValidator::DATE,
      "id_company" => DataValidator::NUMBER,
      "available_slots" => DataValidator::NUMBER,
      "id_business_sector" => DataValidator::NUMBER,
      "base_salary" => DataValidator::NUMBER,
      "internship_duration" => DataValidator::NUMBER,
      "id_city" => DataValidator::NUMBER);

    DataValidator::catchValidationErrors($data, $pattern, $errorCode);

    return;
  }
}
