<?php

class ClassModel {
  private PDO $conn;
  public function __construct()
  {
    $this->conn = Database::getConnection();
  }
 
  // @return mixed[]
  public function getAll(string $id_user): array {
    $sql = "
    SELECT id_user, C.id_class as id_class, class_year as class_name
    FROM Related_to_class
            JOIN web_project.Classes C on C.id_class = Related_to_class.id_class
    WHERE id_user = :id_user
    ";

    $statement = $this->conn->prepare($sql);

    $statement->bindValue(":id_user", $id_user);

    $statement->execute();

    return $statement->fetchAll(PDO::FETCH_ASSOC);
  }

  // @return mixed[]
  public function get(string $id_user, string $id_class) : array | false
  {
    $sql = "
    SELECT id_user, C.id_class as id_class, class_year as class_name
    FROM Related_to_class
            JOIN web_project.Classes C on C.id_class = Related_to_class.id_class
    WHERE id_user = :id_user
      AND C.id_class = :id_class
    ";

    $statement = $this->conn->prepare($sql);

    $statement->bindValue(":id_user", $id_user);
    $statement->bindValue(":id_class", $id_class);

    $statement->execute();

    return $statement->fetch(PDO::FETCH_ASSOC);
  }
}
