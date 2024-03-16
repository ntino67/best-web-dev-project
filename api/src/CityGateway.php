<?php

class CityGateway
{
  private PDO $conn;
  
  public function __construct()
  {
    $this->conn = Database::getConnection();
  }

  // @return mixed[]
  public function getAll(): array
  {
    $sql = "SELECT Cities.id_city, Cities.name AS city_name, C.id_country, C.name AS country_name FROM web_project.Cities JOIN web_project.Country C on C.id_country = Cities.id_country";
    
    $statement = $this->conn->query($sql);

    return $statement->fetchAll(PDO::FETCH_ASSOC);
  }

  // @return mixed[]
  public function get(string $id) : array | false
  {
    $sql = "SELECT Cities.id_city, Cities.name AS city_name, C.id_country, C.name AS country_name FROM web_project.Cities JOIN web_project.Country C on C.id_country = Cities.id_country WHERE id_city = :id";

    $statement = $this->conn->prepare($sql);

    $statement->bindValue(":id", $id, PDO::PARAM_INT);

    $statement->execute();

    return $statement->fetch(PDO::FETCH_ASSOC);
  }
}
