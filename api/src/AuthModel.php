<?php

class AuthModel {
  private PDO $conn;

  // ## Constructor ##
  public function __construct() {
    $this->conn = Database::getConnection();
  }

  // ## Query methods ##
  // Check password
  // @return array | false
  public function checkCredentials(string $email, string $password) : array | false
  {
    $sql = "
    CALL uspLogin(:email, :password, @responseMessage, @id_user);
    ";

    $statement = $this->conn->prepare($sql);

    $statement->bindValue(":email", $email, PDO::PARAM_STR);
    $statement->bindValue(":password", $password, PDO::PARAM_STR);

    $statement->execute();

    return $this->conn->query("SELECT @responseMessage, @id_user")->fetchAll(PDO::FETCH_ASSOC);
  }
}
