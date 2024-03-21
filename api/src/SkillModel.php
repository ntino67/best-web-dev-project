<?php

class SkillModel
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
    SELECT id_skill, skill_name, COUNT(*) OVER() AS total_count
    FROM Skills
    ";

    //Add paging
    $sql = $sql . " LIMIT :offset , :limit";

    $statement = $this->conn->prepare($sql);

    list($offset, $limit) = Paging::get();

    $statement->bindValue(":offset", $offset);
    $statement->bindValue(":limit", $limit);

    $statement->execute();

    return $statement->fetchAll(PDO::FETCH_ASSOC);
  }

  // @return mixed[]
  public function get(string $id) : array | false
  {
    $sql = "
    SELECT id_skill, skill_name
    FROM Skills
    WHERE id_skill = :id
    ";

    $statement = $this->conn->prepare($sql);

    $statement->bindValue(":id", $id, PDO::PARAM_INT);

    $statement->execute();

    return $statement->fetch(PDO::FETCH_ASSOC);
  }
}
