<?php

class AuthController {
  private AuthModel $model;

  public function __construct() {
    $this->model = new AuthModel;
  }

  // Process authentication requests
  public function authenticateUser(string $method) : void {
    // Only accept POST requests
    if($method != "POST") {
      http_response_code(405);
      exit();
    }

    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);

    $data = (array) json_decode(file_get_contents("php://input"), true);

    $loginInfo = $this->model->checkCredentials($data["email"], $data["password"])[0];

    // ## Login successful ##
    if ($loginInfo["@responseMessage"])
    {
      http_response_code(201);
      $userMoodel = new UserModel;
      $userInfo = $userMoodel->get($loginInfo["@id_user"]);

      $token = $this->generateToken($loginInfo["@id_user"], $userInfo);

      echo json_encode(["message" => "Login successful", "token" => $token, "data" => $userInfo]); }

      // ## Login failed ##
    else
    {
      http_response_code(401);
      echo json_encode(["message" => "Invalid credentials"]);
    }
  }

  public function generateToken(string $id_user, array $data) : string
  {
    $issued_at = time();
    $expires_at = $issued_at + 28800; // token expires in 8 hours

    $payload = [
      "iat" => $issued_at,
      "exp" => $expires_at,
      "data" => $data
    ];
    
    $token = \Firebase\JWT\JWT::encode($payload, Config::JWT_SECRET, "HS256");

    return $token;
  }

  public function verifyToken(string $token) : bool
  {
    try
    {
      $decoded = \Firebase\JWT\JWT::decode($token, new \Firebase\JWT\Key(Config::JWT_SECRET, "HS256"));
      
      return time() < ((array) $decoded)["exp"];
    }
    catch (\Exception $e)
    {
      return false;
    }
  }
}
