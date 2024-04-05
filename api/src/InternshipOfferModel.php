<?php

class InternshipOfferModel extends Model {
  public function __construct()
  {
    parent::__construct();

    $this->insert_params = ["id_company", "available_slots", "internship_offer_title", "internship_offer_description", "internship_offer_created_at", "internship_offer_expires_at", "id_business_sector", "base_salary", "internship_duration", "id_city"];

    $allowed_orderby = [
      "id_internship_offer" => "id_internship_offer",
      "internship_offer_title" => "internship_offer_title",
      "internship_offer_description" => "internship_offer_description",
      "business_sector_name" => "Bs.business_sector_name",
      "available_slots" => "available_slots",
      "internship_duration" => "internship_duration",
      "internship_offer_created_at" => "internship_offer_created_at",
      "internship_offer_expires_at" => "internship_offer_expires_at",
      "base_salary" => "base_salary",
      "company_name" => "C.company_name",
      "id_city" => "id_city"
    ];

    $orderBy = Sorting::getFromQueryString($allowed_orderby);

    $allowed_filters = [
      "id_internship_offer" => ["type" => Filter::NUMBER, "replace" => "id_internship_offer"],
      "internship_offer_title" => ["type" => Filter::STRING, "replace" => "internship_offer_title"],
      "internship_offer_description" => ["type" => Filter::STRING, "replace" => "internship_offer_description"],
      "id_business_sector" => ["type" => Filter::NUMBER, "replace" => "Internship_offers.id_business_sector"],
      "business_sector_name" => ["type" => Filter::STRING, "replace" => "Bs.business_sector_name"],
      "available_slots" => ["type" => Filter::NUMBER, "replace" => "available_slots"],
      "internship_duration" => ["type" => Filter::NUMBER, "replace" => "internship_duration"],
      "base_salary" => ["type" => Filter::NUMBER, "replace" => "base_salary"],
      "company_name" => ["type" => Filter::STRING, "replace" => "C.company_name"],
      "id_city" => ["type" => Filter::NUMBER, "replace" => "id_city"]
    ];

    $filter = Filter::getFromQueryString($allowed_filters);

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
          id_city,
          COUNT(*) OVER() AS total_count
    FROM Internship_offers
            JOIN web_project.Companies C on Internship_offers.id_company = C.id_company
            JOIN web_project.Business_sectors Bs on Bs.id_business_sector = Internship_offers.id_business_sector
    WHERE $filter internship_offer_active = 1
    ORDER BY $orderBy
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
          C.company_name,
          id_city
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
                                  id_city,
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
            :id_city,
            1)
    ";


    $this->sql_update = "
    UPDATE Internship_offers
        SET id_company = :id_company,
        available_slots = :available_slots,
        internship_offer_title = :internship_offer_title,
        internship_offer_description = :internship_offer_description,
        internship_offer_created_at = :internship_offer_created_at,
        internship_offer_expires_at = :internship_offer_expires_at,
        id_business_sector = :id_business_sector,
        base_salary = :base_salary,
        internship_duration = :internship_duration,
        id_city = :id_city
        WHERE id_internship_offer = :id_object
    ";


    $this->sql_delete = "
    UPDATE Internship_offers
        SET internship_offer_active = 0
        WHERE id_internship_offer = :id_object
    ";
  }
}

/*{
    "id_company": 22,
    "available_slots": 60,
    "internship_offer_title": "totalement dérivée",
    "internship_offer_description": "hyzgthbgtrhjgyhbjdrtcfgvbhrcgtfvcfgvctfgedrfttfr",
    "internship_offer_created_at": "2024-01-21",
    "internship_offer_expires_at": "2024-07-21",
    "id_business_sector": 4,
    "base_salary": 5000,
    "internship_duration": 8,
    "id_city" : 6
}*/