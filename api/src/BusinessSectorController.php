<?php

class BusinessSectorController
{
  private BusinessSectorModel $model;

  public function __construct()
  {
    $this->model = new BusinessSectorModel;
  }

  // Processes requests for business sectors
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

  // Process requests for a single city 
  // @param $requestURI Elements of the link of the request
  private function processRessourceRequest(string $method, string $id) : void 
  {
    $data = $this->model->get($id);

    if (!$data) {
      http_response_code(404);
      echo json_encode(["message" => "Business sector not found"]);
      return;
    }
    
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

  // Process requests for multiple cities 
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
