<?php

class UserGateway
{
  private PDO $conn;

  public function __construct()
  {
    $this->conn = Database::getConnection();
  }

  // @return mixed[]
  public function getAll(): array {
    $sql = "SELECT id_user, first_name, last_name, email, C.id_center, C.center_name, R.id_role, R.name AS role_name FROM Users JOIN web_project.Centers C on C.id_center = Users.id_center JOIN web_project.Roles R on R.id_role = Users.id_role WHERE user_active = 1";
    
    $statement = $this->conn->query($sql);

    return $statement->fetchAll(PDO::FETCH_ASSOC);
  }

  // @return mixed[]
  public function get(string $id) : array | false
  {
    $sql = "SELECT id_user, first_name, last_name, email, C.id_center, C.center_name, R.id_role, R.name AS role_name FROM Users JOIN web_project.Centers C on C.id_center = Users.id_center JOIN web_project.Roles R on R.id_role = Users.id_role WHERE user_active = 1 AND id_user = :id";

    $statement = $this->conn->prepare($sql);

    $statement->bindValue(":id", $id, PDO::PARAM_INT);

    $statement->execute();

    return $statement->fetch(PDO::FETCH_ASSOC);
  }
}
