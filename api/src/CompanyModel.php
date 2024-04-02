<?php

class CompanyModel
{
  private PDO $conn;
 
  public function __construct()
  {
    $this->conn = Database::getConnection();
  }

  // @return mixed[]
  public function getAll() : array
  {
    $sql = "
    SELECT id_company, company_name, company_description, company_active, Companies.id_business_sector, business_sector_name, COUNT(*) OVER() AS total_count
    FROM Companies
    JOIN web_project.Business_sectors Bs on Bs.id_business_sector = Companies.id_business_sector
    WHERE company_active = 1
    ORDER BY Companies.id_company
    ";
    
    //Add paging
    $sql = $sql . " LIMIT :offset , :limit";
    $statement = $this->conn->prepare($sql);
    
    list($offset, $limit) = Paging::getValues();

    $statement->bindValue(":offset", $offset);
    $statement->bindValue(":limit", $limit);

    $statement->execute();

    return $statement->fetchAll(PDO::FETCH_ASSOC);
  }

  // @return mixed[]
  public function get(string $id) : array | false
  {
    
    $sql = "
    SELECT id_company, company_name, company_description, company_active, Companies.id_business_sector, business_sector_name
    FROM Companies
    JOIN web_project.Business_sectors Bs on Bs.id_business_sector = Companies.id_business_sector
    WHERE company_active = 1
      AND id_company = :id
    ";

    $statement = $this->conn->prepare($sql);

    $statement->bindValue(":id", $id, PDO::PARAM_INT);

    $statement->execute();

    return $statement->fetch(PDO::FETCH_ASSOC);
  }
}
