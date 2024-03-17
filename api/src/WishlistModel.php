
<?php

class WishlistModel
{
  private PDO $conn;

  public function __construct()
  {
    $this->conn = Database::getConnection();
  }

  public function getAll(string $id_user) : array | false
  {
    $sql = "SELECT
      Wish_list.id_internship_offer,
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
      WHERE id_user = :id_user";

    //Add paging
    $sql = $sql . " LIMIT :offset , :limit";

    $statement = $this->conn->prepare($sql);
    
    list($offset, $limit) = Paging::get();

    $statement->bindValue(":offset", $offset);
    $statement->bindValue(":limit", $limit);

    $statement->bindValue(":id_user", $id_user, PDO::PARAM_INT);
    
    $statement->execute();

    return $statement->fetch(PDO::FETCH_ASSOC);
  }
}
