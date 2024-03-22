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
    $sql = "
    SELECT id_internship_offer,
          internship_offer_title,
          internship_offer_description,
          Internship_offers.id_business_sector,
          Bs.business_sector_name,
          available_slots,
          internship_duration,
          internship_offer_created_at,
          internship_offer_expires_at,
          base_salary,
          C.id_company,
          C.company_name,
          COUNT(*) OVER() AS total_count
    FROM Internship_offers
            JOIN web_project.Companies C on Internship_offers.id_company = C.id_company
            JOIN web_project.Business_sectors Bs on Bs.id_business_sector = Internship_offers.id_business_sector
    WHERE internship_offer_active = 1
    ORDER BY id_internship_offer
    ";

    //Add paging
    $sql = $sql . " LIMIT :offset , :limit";

    $statement = $this->conn->prepare($sql);
    
    // Get and bind paging data
    list($offset, $limit) = Paging::getValues();

    $statement->bindValue(":offset", $offset);
    $statement->bindValue(":limit", $limit);
    
    // Execute the query
    $statement->execute();

    return $statement->fetchAll(PDO::FETCH_ASSOC);
  }

  // @return mixed[]
  public function get(string $id) : array | false
  {
    $sql = "
    SELECT id_internship_offer,
          internship_offer_title,
          internship_offer_description,
          Internship_offers.id_business_sector,
          Bs.business_sector_name,
          available_slots,
          internship_duration,
          internship_offer_created_at,
          internship_offer_expires_at,
          base_salary,
          C.id_company,
          C.company_name
    FROM Internship_offers
            JOIN web_project.Companies C on Internship_offers.id_company = C.id_company
            JOIN web_project.Business_sectors Bs on Bs.id_business_sector = Internship_offers.id_business_sector
    WHERE internship_offer_active = 1
    AND id_internship_offer = :id
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
    INSERT INTO Internship_offers (id_company,
                                  available_slots,
                                  internship_offer_title,
                                  internship_offer_description,
                                  internship_offer_created_at,
                                  internship_offer_expires_at,
                                  id_business_sector,
                                  base_salary,
                                  internship_duration,
                                  internship_offer_active)
    VALUES (:id_company,
            :available_slots,
            :internship_offer_title,
            :internship_offer_description,
            :internship_offer_created_at,
            :internship_offer_expires_at,
            :id_business_sector,
            :base_salary,
            :internship_duration,
            1)
    ";

    $statement = $this->conn->prepare($sql);
    
    $insert = array("id_company", "available_slots", "internship_offer_title", "internship_offer_description", "internship_offer_created_at", "internship_offer_expires_at", "id_business_sector", "base_salary", "internship_duration");
    
    foreach ($insert as $i) {
      $statement->bindValue(":$i", $data[$i]);
    }

    $statement->execute();
    
    return $this->conn->lastInsertId();
  }
}
