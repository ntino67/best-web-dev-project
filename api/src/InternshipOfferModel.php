<?php

class InternshipOfferModel extends Model {
  public function __construct()
  {
    parent::__construct();
    $this->insert_params = ["id_company", "available_slots", "internship_offer_title", "internship_offer_description", "internship_offer_created_at", "internship_offer_expires_at", "id_business_sector", "base_salary", "internship_duration"];
    $this->use_paging = true;
    $this->use_parent_id = false;

    $this->sql_getAll = "
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

    $this->sql_get = "
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
    AND id_internship_offer = :id_object
    ";
    
    $this->sql_create = "
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

    $this->sql_delete = "
    UPDATE Internship_offers
        SET internship_offer_active = 0
        WHERE id_internship_offer = :id_object
    ";
  }
}
