<?php


class CompanyReviewController
{
    private CompanyReviewModel $model;
    private string $id_company;

    public function __construct(string $id_company)
    {
        $this->id_company = $id_company;

        $this->model = new CompanyReviewModel();
    }

    // Processes requests for required skills
    // @param $method http method
    // @param $requestURI Elements of the link of the request
    public function processRequest(string $method, array $requestURI): void
    {
        if (array_key_exists(0, $requestURI) && $requestURI[0]) {
            $this->processRessourceRequest($method, $requestURI[0]);
        } else {
            $this->processCollectionRequest($method);
        }
    }

    // Process requests for a single required skill
    // @param $requestURI Elements of the link of the request
    private function processRessourceRequest(string $method, string $id): void
    {
        $data = $this->model->get($id, $this->id_company);
        if (!$data) {
            http_response_code(404);
            echo json_encode(["message" => "Reviews $id not found for company $this->id_company"]);
            return;
        }

        switch ($method) {
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
    private function processCollectionRequest(string $method): void
    {
        switch ($method) {
            case "GET":
                http_response_code(200);
                echo json_encode($this->model->getAll($this->id_company));
                break;
            case "POST":
                $data = (array)json_decode(file_get_contents("php://input"), true);

                self::checkData($data, 422);

                $this->model->create($data, $this->id_company);
                echo json_encode([
                    "message" => "Company review created",
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
    public static function checkData(array $data, $errorCode): void
    {
        $pattern = array(
            "id_user" => DataValidator::NUMBER,
            "review_text" => DataValidator::NAME,
            "review_score" => DataValidator::NUMBER
        );

        DataValidator::catchValidationErrors($data, $pattern, $errorCode);

        return;
    }
}
