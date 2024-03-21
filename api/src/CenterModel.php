<?php

class CenterModel
{
  private PDO $conn;

  public function __construct()
  {
    $this->conn = Database::getConnection();
  }

  // @return mixed[]
  public function getAll(): array 
  {
    $sql = "
    SELECT *, COUNT(*) OVER() AS total_count
    FROM Centers
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
    SELECT *
    FROM Centers
    WHERE id_center = :id
    ";

    $statement = $this->conn->prepare($sql);

    $statement->bindValue(":id", $id, PDO::PARAM_INT);

    $statement->execute();

    return $statement->fetch(PDO::FETCH_ASSOC);
  }
}
