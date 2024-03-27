<?php

class WishlistModel
{
  private PDO $conn;

  public function __construct()
  {
    $this->conn = Database::getConnection();
  }

  // @return mixed[]
  public function getAll(string $id_user) : array | false
  {
    $sql = "
    SELECT Wish_list.id_internship_offer,
          C.id_company,
          available_slots,
          base_salary,
          company_name,
          internship_duration,
          internship_offer_created_at,
          internship_offer_description,
          internship_offer_expires_at,
          internship_offer_title,
          COUNT(*) OVER () AS total_count
    FROM Wish_list
            JOIN web_project.Internship_offers I
                  on Wish_list.id_internship_offer = I.id_internship_offer
            JOIN web_project.Companies C
                  on C.id_company = I.id_company
    WHERE id_user = :id_user
    ";

    //Add paging
    $sql = $sql . " LIMIT :offset , :limit";

    $statement = $this->conn->prepare($sql);
    
    list($offset, $limit) = Paging::getValues();

    $statement->bindValue(":offset", $offset);
    $statement->bindValue(":limit", $limit);

    $statement->bindValue(":id_user", $id_user, PDO::PARAM_INT);
    
    $statement->execute();

    return $statement->fetchAll(PDO::FETCH_ASSOC);
  }

  // @return mixed[]
  public function get(string $id_user, string $id_internship_offer) : array | false
  {
    $sql = "
    SELECT Wish_list.id_internship_offer,
          C.id_company,
          available_slots,
          base_salary,
          company_name,
          internship_duration,
          internship_offer_created_at,
          internship_offer_description,
          internship_offer_expires_at,
          internship_offer_title
    FROM Wish_list
            JOIN web_project.Internship_offers I
                  on Wish_list.id_internship_offer = I.id_internship_offer
            JOIN web_project.Companies C
                  on C.id_company = I.id_company
    WHERE id_user = :id_user
      AND Wish_list.id_internship_offer = :id_internship_offer
    ";

    //Add paging
    $sql = $sql . " LIMIT :offset , :limit";

    $statement = $this->conn->prepare($sql);
    
    list($offset, $limit) = Paging::getValues();

    $statement->bindValue(":offset", $offset);
    $statement->bindValue(":limit", $limit);

    $statement->bindValue(":id_user", $id_user, PDO::PARAM_INT);
    $statement->bindValue(":id_internship_offer", $id_internship_offer, PDO::PARAM_INT);
    
    $statement->execute();

    return $statement->fetch(PDO::FETCH_ASSOC);
  }

  // @return mixed[] $data
  public function create(string $id_user, string $id_internship_offer) : void
  {
    $sql = "
    INSERT INTO Wish_list (id_user,
                          id_internship_offer)
    VALUES (:id_user, 
            :id_internship_offer)
    ";

    $statement = $this->conn->prepare($sql);
    
    $statement->bindValue(":id_user", $id_user, PDO::PARAM_INT);
    $statement->bindValue(":id_internship_offer", $id_internship_offer, PDO::PARAM_INT);

    $statement->execute();

    return;
  }

  public function delete(string $id_user, string $id_internship_offer) : int
  {
    $sql = "
    DELETE
    FROM Wish_list
    WHERE id_user = :id_user
      AND id_internship_offer = :id_internship_offer
    ";

    $statement = $this->conn->prepare($sql);
    
    $statement->bindValue(":id_user", $id_user, PDO::PARAM_INT);
    $statement->bindValue(":id_internship_offer", $id_internship_offer, PDO::PARAM_INT);

    $statement->execute();

    return $statement->rowCount();
  }

}
