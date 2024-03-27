<?php

// Fetch an internship offer's required skills

class RequiredSkillsModel {
  private PDO $conn;

  public function __construct()
  {
    $this->conn = Database::getConnection();
  }

  public function getAll(string $id_internship_offer): array | false
  {
    $sql = "
    SELECT Required_Skills.id_skill, skill_name
    FROM Required_Skills
            JOIN web_project.Skills S on S.id_skill = Required_Skills.id_skill
    WHERE id_internship_offer = :id_internship_offer
    ";

    $statement = $this->conn->prepare($sql);
    
    $statement->bindValue(":id_internship_offer", $id_internship_offer, PDO::PARAM_INT);

    $statement->execute();

    return $statement->fetchAll(PDO::FETCH_ASSOC);
  }

  //@return mixed[]
  public function get(string $id_internship_offer, string $id_skill) : array | false
  {
    $sql = "
    SELECT Required_Skills.id_skill, skill_name
    FROM Required_Skills
            JOIN web_project.Skills S on S.id_skill = Required_Skills.id_skill
    WHERE id_internship_offer = :id_internship_offer
    AND Required_Skills.id_skill = :id_skill
    ";

    $statement = $this->conn->prepare($sql);

    $statement->bindValue(":id_internship_offer", $id_internship_offer, PDO::PARAM_INT);
    $statement->bindValue(":id_skill", $id_skill, PDO::PARAM_INT);

    $statement->execute();

    return $statement->fetch(PDO::FETCH_ASSOC);
  }

  //@return mixed[] $data
  public function create(string $id_internship_offer, string $id_skill) : void
  {
    $sql = "
    INSERT INTO Required_Skills (
                                id_internship_offer,
                                id_skill)
    VALUES (:id_internship_offer,
            :id_skill)
    ";

    $statement = $this->conn->prepare($sql);

    $statement->bindValue(":id_internship_offer", $id_internship_offer, PDO::PARAM_INT);
    $statement->bindValue(":id_skill", $id_skill, PDO::PARAM_INT);

    $statement->execute();
  }

  public function delete(string $id_internship_offer, string $id_skill) : int
  {
    $sql = "
    DELETE FROM Required_Skills
    WHERE id_internship_offer = :id_internship_offer
    AND id_skill = :id_skill
    ";

    $statement = $this->conn->prepare($sql);

    $statement->bindValue(":id_internship_offer", $id_internship_offer, PDO::PARAM_INT);
    $statement->bindValue(":id_skill", $id_skill, PDO::PARAM_INT);

    $statement->execute();

    return $statement->rowCount();
  }
}
