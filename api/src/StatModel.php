<?php

class StatModel {
  // ## Database connection ##
  private PDO $conn;

  // ## Constructor ##
  public function __construct() {
    $this->conn = Database::getConnection();
  }

  // ## Query methods ##

  public function getCompaniesPerSector() : array | false {
    $sql = "
    SELECT C.id_business_sector, business_sector_name, COUNT(*) AS Companies FROM Business_sectors
    LEFT JOIN web_project.Companies C on Business_sectors.id_business_sector = C.id_business_sector
    GROUP BY C.id_business_sector
    ";

    $statement = $this->conn->prepare($sql);

    $statement->execute();

    return $statement->fetchAll(PDO::FETCH_ASSOC);
  }
  
  public function getUsersPerClass() : array | false {
    $sql = "
    SELECT Classes.id_class, class_year, COUNT(*) AS Users FROM Classes
    LEFT JOIN web_project.Related_to_class Rtc on Classes.id_class = Rtc.id_class
    GROUP BY id_user
    ";

    $statement = $this->conn->prepare($sql);

    $statement->execute();

    return $statement->fetchAll(PDO::FETCH_ASSOC);
  }   

}
