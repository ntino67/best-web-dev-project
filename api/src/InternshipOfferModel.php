<?php

class InternshipOfferModel
{
  private PDO $conn;

  public function __construct()
  {
    $this->conn = Database::getConnection();
  }

  //@return mixed[]
  public function getAll(): array {
    $sql = "SELECT id_internship_offer, internship_offer_title, internship_offer_description, available_slots, internship_duration, internship_offer_created_at, internship_offer_expires_at, base_salary, C.id_company, C.company_name  FROM Internship_offers JOIN web_project.Companies C on Internship_offers.id_company = C.id_company WHERE internship_offer_active = 1";

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
    $sql = "SELECT id_internship_offer, internship_offer_title, internship_offer_description, available_slots, internship_duration, internship_offer_created_at, internship_offer_expires_at, base_salary, C.id_company, C.company_name  FROM Internship_offers JOIN web_project.Companies C on Internship_offers.id_company = C.id_company WHERE internship_offer_active = 1 AND id_internship_offer = :id";

    $statement = $this->conn->prepare($sql);

    $statement->bindValue(":id", $id, PDO::PARAM_INT);

    $statement->execute();

    return $statement->fetch(PDO::FETCH_ASSOC);
  }
}
