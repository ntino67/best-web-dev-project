<?php

class CompanyController
{
    private CompanyModel $model;

    public function __construct()
    {
        $this->model = new CompanyModel();
    }

    // Processes requests for companies
    // @param $method http method
    // @param $requestURI Elements of the link of the request
    public function processRequest(string $method, array $requestURI): void
    {
        if (array_key_exists(0, $requestURI) && $requestURI[0]) {
            $this->processRessourceRequest($method, $requestURI);
        } else {
            $this->processCollectionRequest($method);
        }
    }

    // Process requests for a single company
    // @param $requestURI Elements of the link of the request
    private function processRessourceRequest(string $method, array $requestURI): void
    {
        $id = array_shift($requestURI);
        $data = $this->model->get($id);

        if (!$data) {
            http_response_code(404);

            echo json_encode(["message" => "Company not found"]);

            return;
        }

        // If the business sector is requested */
        if (array_key_exists(0, $requestURI) && $requestURI[0]) {
           switch(array_shift($requestURI)) {
           case "review":
             $controller = new CompanyReviewController($id);
             $controller->processRequest($method, $requestURI);
             break;
            case "locations":
                $controller = new CompanyLocationController($id);
                $controller->processRequest($method, $requestURI);
                break;
           default:
             http_response_code(404);
             break;
           }
           return;
         }

        switch ($method) {

            case "GET" :
                http_response_code(200);

                echo json_encode($data);

                break;

            case "PATCH":
                $data = json_decode(file_get_contents("php://input"), true);

                $this->checkData($data, 422);

                $rows = $this->model->update($data, $id);

                echo json_encode([
                    "message" => "Company edited",
                    "rows" => $rows
                ]);


                break;

            case "DELETE" :
                $affectedRows = $this->model->delete($id);

                echo json_encode([
                    "message" => "Company disabled",
                    "rows" => $affectedRows
                ]);
                break;

            default:
                http_response_code(405);
                break;
        }
    }

    // Process requests for multiple companies
    // @param $method http method
    private function processCollectionRequest(string $method): void
    {
        switch ($method) {
            case "GET" :
                http_response_code(200);

                $data = $this->model->getAll();

                $data = Paging::appendToResults($data);

                echo json_encode($data);

                break;

            case "POST" :
                $data = json_decode(file_get_contents("php://input"), true);

                $this->checkData($data, 422);

                $id = $this->model->create($data);

                echo json_encode([
                    "message" => "Company created",
                    "id" => $id
                ]);
                http_response_code(201);
                break;

            default:
                http_response_code(405);
                break;
        }
    }
    private function checkData(array $data, int $errorCode) : void
    {
        $pattern = array(
            "id_business_sector" => DataValidator::NUMBER,
            "company_name" => DataValidator::NAME,
            "company_description" => DataValidator::NAME);

        DataValidator::catchValidationErrors($data, $pattern, $errorCode);

        return;
    }
}
