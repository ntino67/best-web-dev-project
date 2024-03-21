<?php

class UserModel
{
  private PDO $conn;

  public function __construct()
  {
    $this->conn = Database::getConnection();
  }

  // @return mixed[]
  // @param int $offset Amout of elements to ignore
  // @param int $limit Max amount of elements to fetch
  public function getAll(): array {
    $sql = "
    SELECT id_user,
          first_name,
          last_name,
          email,
          C.id_center,
          C.center_name,
          R.id_role,
          R.name AS role_name,
          COUNT(*) OVER() AS total_count
    FROM Users
            JOIN web_project.Centers C on C.id_center = Users.id_center
            JOIN web_project.Roles R on R.id_role = Users.id_role
    WHERE user_active = 1
    ORDER BY Users.id_user
    ";

    //Add paging
    $sql = $sql . " LIMIT :offset , :limit";

    $statement = $this->conn->prepare($sql);

    list($offset, $limit) = Paging::get();

    $statement->bindValue(":limit", $limit);
    $statement->bindValue(":offset", $offset);

    $statement->execute();

    return $statement->fetchAll(PDO::FETCH_ASSOC);
  }

  // @return mixed[]
  public function get(string $id) : array | false
  {
    $sql = "
    SELECT id_user,
          first_name,
          last_name,
          email,
          C.id_center,
          C.center_name,
          R.id_role,
          R.name AS role_name
    FROM Users
            JOIN web_project.Centers C on C.id_center = Users.id_center
            JOIN web_project.Roles R on R.id_role = Users.id_role
    WHERE user_active = 1
      AND id_user = :id
    ";

    $statement = $this->conn->prepare($sql);

    $statement->bindValue(":id", $id, PDO::PARAM_INT);

    $statement->execute();

    return $statement->fetch(PDO::FETCH_ASSOC);
  }

  // @param mixed[] $data
  public function create(array $data) : int | false
  {
    $sql = "
    INSERT INTO Users (first_name,
                      last_name,
                      email, password,
                      user_created_at,
                      id_center,
                      id_role,
                      user_active)

    VALUES (:first_name,
            :last_name,
            :email,
            :password,
            CURRENT_TIMESTAMP,
            :id_center,
            :id_role,
            1);
    ";

    $statement = $this->conn->prepare($sql);
    
    $insert = array("first_name", "last_name", "email", "password", "id_center", "id_role");
    
    foreach ($insert as $i) {
      $statement->bindValue(":$i", $data[$i]);
    }

    $statement->execute();
    
    return $this->conn->lastInsertId();
  }
}
