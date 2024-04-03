<?php

class WishlistModel extends Model {

  public function __construct() 
  {
    parent::__construct();

    $this->insert_params = ["id_internship_offer"];

    $this->use_paging = true;

    // Wishlist refers to a user, so we use the parent_id field
    $this->use_parent_id = true;

    $this->sql_getAll = "
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
    WHERE id_user = :id_parent
    ";

    $this->sql_get = "
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
    WHERE id_user = :id_parent
      AND Wish_list.id_internship_offer = :id_object;
    ";

    $this->sql_create = "
    INSERT INTO Wish_list (id_user,
                          id_internship_offer)
    VALUES (:id_parent, 
            :id_internship_offer);
    ";

    $this->sql_delete = "
    DELETE
    FROM Wish_list
    WHERE id_user =:id_parent
      AND id_internship_offer = :id_object;
    ";
  }

}
