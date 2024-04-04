<?php

class StatController {
  private StatModel $model;

  public function __construct() {
    $this->model = new StatModel;
  }

  public function processRequest(string $method, array $requestURI) : void {
    if ($method != "GET") {
      http_response_code(405);
      exit();
    }


    $data = array();

    $data["companiesPerSector"] = $this->model->getCompaniesPerSector();

    $data["usersPerClass"] = $this->model->getUsersPerClass();

    echo json_encode($data);
  }
}
