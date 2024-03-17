<?php

class InternshipOfferController
{
  private InternshipOfferModel $model;

  public function __construct()
  {
    $this->model = new InternshipOfferModel();
  }

  // Processes database requests for Internship offers
  // @param $method http method
  // @param $requestURI Elements of the link of the request
  
  public function processRequest(string $method, array $requestURI) : void
  {
    if (array_key_exists(0, $requestURI)) {
      $this->processRessourceRequest($method, $requestURI[0]);
    }
    else {
      $this->processCollectionRequest($method);
    }
  }

  private function processRessourceRequest(string $method, string $id) : void 
  {
    $data = $this->model->get($id);

    if (!$data) {
      http_response_code(404);
      echo json_encode(["message" => "Internship not found"]);
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
